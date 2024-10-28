import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { Cart } from 'src/entities/cart.entity';
import { CartDetail } from 'src/entities/cart-detail.entity';
import { Product } from '../entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, CartDetail, Product])],
  providers: [CartService],
  controllers: [CartController],
})
export class CartModule {}
