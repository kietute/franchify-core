import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { Cart } from '@/entities/cart.entity';
import { CartDetail } from '@/entities/cartDetail.entity';
import { ProductsModule } from '@/products/products.module';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, CartDetail]), ProductsModule],
  providers: [CartService],
  controllers: [CartController],
  exports: [CartService],
})
export class CartModule {}
