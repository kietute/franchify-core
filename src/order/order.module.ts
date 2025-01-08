import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '@/entities/order.entity';
import { OrderDetail } from '@/entities/order-detail.entity';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderRepo } from './order.repo';
import { CartModule } from '@/cart/cart.module';
import { StoreModule } from '@/store/store.module';
import { ProductsModule } from '@/products/products.module';
import { PaymentModule } from '@/payment/payment.module';

@Module({
  imports: [
    CartModule,
    StoreModule,
    ProductsModule,
    PaymentModule,
    TypeOrmModule.forFeature([Order, OrderDetail]),
  ],
  providers: [OrderService, OrderRepo],
  controllers: [OrderController],
})
export class OrderModule {}
