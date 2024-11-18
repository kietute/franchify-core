import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddProductToCartDto } from './dtos/add-product-to-cart.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../entities/user.entity';
import { AuthGuard } from '../common/guards/auth.guard';
import { ChangeQuantityDto } from './dtos/change-quantity.dto';

@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createCart(@CurrentUser() user: User) {
    return this.cartService.createCart(user);
  }

  @Get('/')
  @UseGuards(AuthGuard)
  async getCart(@CurrentUser() user: User) {
    return this.cartService.getCart(user);
  }

  @Post('/add-product')
  @UseGuards(AuthGuard)
  async addProductToCart(
    @Body() body: AddProductToCartDto,
    @CurrentUser() user: User,
  ) {
    return this.cartService.addProductToCart(body, user);
  }

  @Get()
  @UseGuards(AuthGuard)
  async getCartDetails(@CurrentUser() currentUser) {
    return this.cartService.getCartDetails(currentUser);
  }

  @Delete('/remove-product/:cartDetailId')
  @UseGuards(AuthGuard)
  async removeProductFromCart(@Param('cartDetailId') cartDetailId: number) {
    return this.cartService.removeProductFromCart(cartDetailId);
  }
  @Post('/change-quantity')
  @UseGuards(AuthGuard)
  async changeQuantity(@Body() body: ChangeQuantityDto) {
    return this.cartService.changeQuantity(body);
  }
  @Delete('/clear/:cartId')
  @UseGuards(AuthGuard)
  async clearCart(@Param('cartId') cartId: number) {
    return this.cartService.clearCart(cartId);
  }
}
