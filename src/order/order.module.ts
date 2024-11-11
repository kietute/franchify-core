import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/entities/order.entity';
import { OrderDetail } from 'src/entities/order-detail.entity';
import { Product } from '../entities/product.entity';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderRepo } from './order.repo';
import { CartModule } from 'src/cart/cart.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderDetail]), CartModule],
  providers: [OrderService, OrderRepo],
  controllers: [OrderController],
})
export class OrderModule {}
