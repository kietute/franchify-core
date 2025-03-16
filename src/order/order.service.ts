import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from '@/entities/user.entity';
import {
  IOrderAddress,
  IOrderUserInfo,
  Order,
  OrderStatus,
} from '@/entities/order.entity';
import { OrderDetail } from '@/entities/order-detail.entity';
import { CartService } from '@/cart/cart.service';
import { OrderRepo } from './order.repo';
import { CreateOrderDto, PaymentMethod } from '@/dtos/order.dto';
import { StoreRepo } from '@/store/store.repo';
import { ProductRepo } from '@/products/products.repo';
import { MailerService } from '@nestjs-modules/mailer';
import { StoreProductRepo } from '@/products/store-product.repo';
import { PaymentService } from '@/payment/payment.service';
@Injectable()
export class OrderService {
  constructor(
    private readonly productRepo: ProductRepo,
    private readonly storeProductRepo: StoreProductRepo,
    private readonly cartService: CartService,
    private readonly orderRepo: OrderRepo,
    private readonly storeRepo: StoreRepo,
    private readonly mailerService: MailerService,
    private readonly paymentService: PaymentService,
  ) {}

  async createOrderFromCart(
    user: User,
    orderInfo: CreateOrderDto,
  ): Promise<{ order: Order; paymentUrl?: string }> {
    const { orderAddress, orderUserInfo, storeId } = orderInfo || {};
    const cart = await this.cartService.getCart(user);
    if (!cart || !cart.cartDetails.length) {
      throw new BadRequestException('Cart is empty');
    }
    try {
      const order = await this.createOrder(
        user,
        orderAddress,
        orderUserInfo,
        storeId,
      );
      const totalAmount = await this.createOrderDetails(
        order,
        cart.cartDetails,
      );
      order.totalAmount = Number(totalAmount);
      const savedOrder = await this.orderRepo.save(order);
      await this.cartService.clearCart(cart.id);
      if (
        orderInfo?.paymentMethod === PaymentMethod.VNPAY ||
        orderInfo?.paymentMethod === PaymentMethod.MOMO
      ) {
        await this.createPaymentUrlForOrder(savedOrder);
        const paymentUrl = await this.createPaymentUrlForOrder(savedOrder);
        return {
          order: savedOrder,
          paymentUrl: paymentUrl,
        };
      } else {
        return { order: savedOrder };
      }
    } catch (error) {
      console.error('Error creating order:', error);
      throw new InternalServerErrorException('Failed to create order');
    }
  }

  private async createPaymentUrlForOrder(order: Order): Promise<string> {
    try {
      const paymentUrl = await this.paymentService.createPaymentUrl({
        orderId: order.id,
        amount: order.totalAmount,
      });
      return paymentUrl;
    } catch (error) {
      console.error('Error creating payment for order:', error);
      throw new InternalServerErrorException('Failed to create payment');
    }
  }

  private async createOrder(
    user: User,
    address: IOrderAddress,
    userInfo: IOrderUserInfo,
    storeId: number,
  ): Promise<Order> {
    const store = await this.storeRepo.findById(storeId);
    return this.orderRepo.create({
      user,
      status: 'pending',
      orderDetails: [],
      orderAddress: address,
      orderUserInfo: userInfo,
      store: store,
    });
  }

  private async createOrderDetails(
    order: Order,
    cartDetails: any[],
  ): Promise<number> {
    let totalAmount = 0;

    console.log('cartDetails', cartDetails);

    for (const cartDetail of cartDetails) {
      try {
        const orderDetail = new OrderDetail();
        orderDetail.product = cartDetail.product;
        orderDetail.quantity = cartDetail.quantity;
        orderDetail.price = cartDetail.product.price.price;

        await this.productRepo.updateBuyCount(cartDetail.product.id);

        totalAmount += Number(orderDetail.quantity) * Number(orderDetail.price);

        order.orderDetails.push(orderDetail);
        if (order?.orderAddress?.shippingFee > 0) {
          totalAmount =
            Number(totalAmount) + Number(order.orderAddress.shippingFee);
        }
        return totalAmount;
      } catch (error) {
        console.error('Error creating order detail:', error);
        throw new InternalServerErrorException('Failed to create order detail');
      }
    }
  }

  async getOrderbyId(orderId: number): Promise<Order> {
    const order = await this.orderRepo.findOne(orderId);

    if (!order) {
      throw new BadRequestException('Order not found');
    }

    return order;
  }

  async cancelOrder(orderId: number): Promise<Order> {
    const order = await this.getOrderbyId(orderId);

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Order cannot be cancelled');
    }

    order.status = OrderStatus.CANCELLED;

    return this.orderRepo.save(order);
  }

  async getOrderByUser(user: User): Promise<Order[]> {
    return this.orderRepo.findByUser(user?.id);
  }

  async getOrderByStore(storeId: number): Promise<Order[]> {
    try {
      const orders = this.orderRepo.findByStore(storeId);

      if (!!orders) {
        return orders;
      }
    } catch (error) {
      throw new InternalServerErrorException('Failed to get orders');
    }
  }

  async deleteAllOrder(user: User): Promise<void> {
    return this.orderRepo.deleteAll(user.id);
  }

  async updateOrderStatus(
    orderId: number,
    status: OrderStatus,
  ): Promise<Order> {
    try {
      const order = await this.getOrderbyId(orderId);
      await this.mailerService.sendMail({
        to: order.orderUserInfo?.email,
        from: 'kietmakietna@gmail.com',
        subject: `Thông báo đơn hàng ${order.id} đã được cập nhật`,
        text: `Đơn hàng ${order.id} đã được cập nhật trạng thái thành ${status}`,
        html: `<div><b>Đơn hàng ${order.id} đã được cập nhật trạng thái thành ${status}</b> <br /> Chi tiết tại: <a href="tea-market.vercel.app/orders">Đơn hàng của bạn</a> </div>`,
      });
      order.status = status;
      const savedOrder = await this.orderRepo.save(order);

      if (order.status == OrderStatus.DELIVERED) {
        await Promise.all(
          order.orderDetails.map(async (orderDetail) => {
            await this.storeProductRepo.updateInventory({
              storeId: order.store.id,
              productId: orderDetail.product.id,
              quantity: orderDetail.quantity,
            });
          }),
        );
      }

      return savedOrder;
    } catch (error) {
      console.log('Error updating order status:', error);
      throw new InternalServerErrorException('Failed to update order status');
    }
  }
}
