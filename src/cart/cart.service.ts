import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from '@/entities/cart.entity';
import { CartDetail } from '@/entities/cartDetail.entity';
import { User } from '@/entities/user.entity';
import { AddProductToCartDto } from '@/dtos/add-product-to-cart.dto';
import { ChangeQuantityDto } from '@/dtos/change-quantity.dto';
import { ProductRepo } from '@/products/products.repo';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private cartRepo: Repository<Cart>,
    @InjectRepository(CartDetail)
    private cartDetailRepo: Repository<CartDetail>,
    private productRepo: ProductRepo,
  ) {}

  async getCartById(cartId: number) {
    try {
      return await this.cartRepo.findOne({
        where: { id: cartId },
        relations: ['cartDetails'],
      });
    } catch (error) {
      throw new Error('Failed to get cart by id');
    }
  }

  async getCart(user: User) {
    try {
      const carts = await this.cartRepo.findOne({
        where: { user: { id: user.id } },
        relations: ['cartDetails', 'cartDetails.product'],
      });

      if (carts) {
        return carts;
      } else {
      }
    } catch (error) {
      throw new Error('Failed to get cart');
    }
  }

  async createCart(user: User) {
    try {
      const cart = this.cartRepo.create({
        user,
      });
      const savedCart = await this.cartRepo.save(cart);
      if (savedCart) {
        return savedCart;
      }
    } catch (error) {
      throw new Error('Failed to create cart');
    }
  }

  async addProductToCart(
    addProductToCartDto: AddProductToCartDto,
    currentUser?: User,
  ) {
    //Check if user is authorized
    if (!currentUser) {
      throw new UnauthorizedException('User is not authorized');
    }

    //Check if product exists
    const product = await this.productRepo.findOne(
      addProductToCartDto.productId,
    );
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    let cart = await this.cartRepo.findOneBy({ user: { id: currentUser.id } });

    if (!cart) {
      cart = await this.createCart(currentUser);
    }

    const cartDetail = this.cartDetailRepo.create({
      cart,
      product,
      quantity: addProductToCartDto.quantity,
    });

    try {
      return await this.cartDetailRepo.save(cartDetail);
    } catch (error) {
      throw new InternalServerErrorException('Server encountered an error');
    }
  }

  async changeQuantity(changeQuantityDto: ChangeQuantityDto) {
    try {
      const cartDetail = await this.cartDetailRepo.findOne({
        where: { id: changeQuantityDto.cartDetailId },
        relations: ['product'],
      });

      if (!cartDetail) {
        throw new NotFoundException('Product item not found');
      }

      cartDetail.quantity = changeQuantityDto.quantity;

      if (cartDetail.quantity < 0) {
        cartDetail.quantity = 0;
      }

      return await this.cartDetailRepo.save(cartDetail);
    } catch (error) {
      throw new Error('Failed to change quantity');
    }
  }

  async getCartDetails(user: User) {
    try {
      return await this.cartDetailRepo.find({
        where: { cart: { user: { id: user.id } } },
        relations: ['product'],
      });
    } catch (error) {
      throw new Error('Failed to get cart details');
    }
  }

  async removeProductFromCart(cartDetailId: number) {
    try {
      await this.cartDetailRepo.delete(cartDetailId);
      return { message: 'Product removed from cart' };
    } catch (error) {
      throw new Error('Failed to remove product from cart');
    }
  }

  async clearCart(cartId: number) {
    try {
      const cart = await this.cartRepo.findOne({
        where: { id: cartId },
        relations: ['cartDetails'],
      });

      if (!cart) {
        throw new Error('Cart not found');
      }

      await this.cartDetailRepo.remove(cart.cartDetails);
      return { message: 'Cart cleared' };
    } catch (error) {
      throw new Error('Failed to clear cart');
    }
  }
}
