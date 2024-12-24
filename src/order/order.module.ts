import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/entities/order.entity';
import { OrderDetail } from 'src/entities/order-detail.entity';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderRepo } from './order.repo';
import { CartModule } from 'src/cart/cart.module';
import { StoreModule } from 'src/store/store.module';
import { ProductsModule } from '@/products/products.module';


@Module({
  imports: [
    CartModule,
    StoreModule,
    ProductsModule,
    TypeOrmModule.forFeature([
      Order,
      OrderDetail,
    ]),
  ],
  providers: [
    OrderService,
    OrderRepo,
  ],
  controllers: [OrderController],
})
export class OrderModule {}
