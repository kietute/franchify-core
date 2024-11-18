import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Patch,
  Put,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../entities/user.entity';
import { CreateOrderDto } from './dtos/index.dto';
import { OrderStatus } from 'src/entities/order.entity';

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

  @Get('/store/:storeId')
  async getOrderByStore(@Param('storeId') storeId: number) {
    return this.orderService.getOrderByStore(storeId);
  }

  @Put('/:orderId')
  async updateOrderStatus(
    @Body() body: { status: OrderStatus },
    @Param('orderId') orderId: number,
  ) {
    return this.orderService.updateOrderStatus(orderId, body.status);
  }
}
