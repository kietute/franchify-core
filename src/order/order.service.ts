import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import {
  IOrderAddress,
  IOrderUserInfo,
  Order,
  OrderStatus,
} from 'src/entities/order.entity';
import { OrderDetail } from 'src/entities/order-detail.entity';
import { CartService } from 'src/cart/cart.service';
import { OrderRepo } from './order.repo';
import { CreateOrderDto } from './dtos/index.dto';
import { StoreRepo } from 'src/store/store.repo';
import { ProductRepo } from 'src/products/products.repo';
import { MailerService } from '@nestjs-modules/mailer';
@Injectable()
export class OrderService {
  constructor(
    private readonly productRepo: ProductRepo,
    private readonly cartService: CartService,
    private readonly orderRepo: OrderRepo,
    private readonly storeRepo: StoreRepo,
    private readonly mailerService: MailerService,
  ) {}

  async createOrderFromCart(
    user: User,
    orderInfo: CreateOrderDto,
  ): Promise<Order> {
    const cart = await this.cartService.getCart(user);

    if (!cart || !cart.cartDetails.length) {
      throw new BadRequestException('Cart is empty');
    }

    try {
      const order = await this.createOrder(
        user,
        orderInfo?.orderAddress,
        orderInfo?.orderUserInfo,
        orderInfo?.isApplyUserSavePoints,
        orderInfo?.storeId,
      );
      const totalAmount = await this.createOrderDetails(
        order,
        cart.cartDetails,
      );

      order.totalAmount = totalAmount;

      const savedOrder = await this.orderRepo.save(order);
      await this.cartService.clearCart(cart.id);

      return savedOrder;
    } catch (error) {
      console.error('Error creating order:', error);
      throw new InternalServerErrorException('Failed to create order');
    }
  }

  private async createOrder(
    user: User,
    address: IOrderAddress,
    userInfo: IOrderUserInfo,
    isApplyUserSavePoints: boolean,
    storeId: number,
  ): Promise<Order> {
    const findedStore = await this.storeRepo.findById(storeId);
    const order = this.orderRepo.create({
      user,
      status: 'pending',
      orderDetails: [],
      orderAddress: address,
      orderUserInfo: userInfo,
      isApplyUserSavePoints: isApplyUserSavePoints,
      store: findedStore,
    });

    return order;
  }

  private async createOrderDetails(
    order: Order,
    cartDetails: any[],
  ): Promise<number> {
    let totalAmount = 0;

    for (const cartDetail of cartDetails) {
      try {
        const orderDetail = new OrderDetail();
        orderDetail.product = cartDetail.product;
        orderDetail.quantity = cartDetail.quantity;
        orderDetail.price = cartDetail.product.price.price;

        await this.productRepo.updateBuyCount(cartDetail.product.id);

        totalAmount += orderDetail.quantity * orderDetail.price;

        order.orderDetails.push(orderDetail);
        if (order?.orderAddress?.shippingFee > 0) {
          totalAmount = totalAmount + order.orderAddress.shippingFee;
        }

        if (order?.isApplyUserSavePoints) {
          totalAmount = totalAmount - order.user.savePoints * 1000;
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
        to: 'tuankiet270802@gmail.com',
        from: 'kietmakietna@gmail.com',
        subject: 'Testing Nest MailerModule ✔',
        text: 'welcome',
        html: '<b>welcome</b>',
      });
      order.status = status;
      return this.orderRepo.save(order);
    } catch (error) {
      console.log('Error updating order status:', error);
      throw new InternalServerErrorException('Failed to update order status');
    }
  }
}
