import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/entities/order.entity';
import { OrderDetail } from 'src/entities/order-detail.entity';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderRepo } from './order.repo';
import { CartModule } from 'src/cart/cart.module';
import { StoreModule } from 'src/store/store.module';
import { StoreRepo } from 'src/store/store.repo';
import { Store } from 'src/entities/store.entity';
import { Product } from 'src/entities/product.entity';
import { ProductRepo } from 'src/products/products.repo';

@Module({
  imports: [
    CartModule,
    StoreModule,

    TypeOrmModule.forFeature([Order, OrderDetail, Store, Product]),
  ],
  providers: [OrderService, OrderRepo, StoreRepo, ProductRepo],
  controllers: [OrderController],
})
export class OrderModule {}
