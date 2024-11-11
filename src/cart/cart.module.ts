import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { Cart } from 'src/entities/cart.entity';
import { CartDetail } from 'src/entities/cart-detail.entity';
import { ProductsModule } from 'src/products/products.module';
import { ProductRepo } from 'src/products/products.repo';
import { Product } from 'src/entities/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, CartDetail, Product]),
    ProductsModule,
  ],
  providers: [CartService, ProductRepo],
  controllers: [CartController],
  exports: [CartService],
})
export class CartModule {}
