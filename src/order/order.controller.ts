import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../entities/user.entity';
import { IOrderAddress } from 'src/entities/order.entity';
import { CreateOrderDto } from './dtos/oder.dto';

// @UseGuards(AuthGuard)
@Controller('orders')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post('/')
  async createOrderFromCart(
    @Body() body: CreateOrderDto,
    @CurrentUser() user: User,
  ) {
    return this.orderService.createOrderFromCart(user, body);
  }

  @Get('/:orderId')
  async getOrder(@Param('orderId') orderId: number) {
    return this.orderService.getOrderbyId(orderId);
  }

  @Delete('/:orderId')
  async cancelOrder(@Param('orderId') orderId: number) {
    return this.orderService.cancelOrder(orderId);
  }

  @Get('/')
  async getOrderByUser(@CurrentUser() user: User) {
    return this.orderService.getOrderByUser(user);
  }

  // @Delete('/clear')
  // async deleteAllOrder(@CurrentUser() user: User) {
  //   return this.orderService.deleteAllOrder(user);
  // }

  // @Patch(':orderId/status')
  // async updateOrderStatus(
  //   @Param('orderId') orderId: number,
  //   @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  // ) {
  //   return this.orderService.updateOrderStatus(orderId, updateOrderStatusDto);
  // }
}
