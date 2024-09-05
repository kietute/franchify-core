import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/entities/product.entity';
import { ProductsContoller } from './products.controller';
import { ProductService } from './products.service';
import { ProductRepo } from './products.repo';
import { StoreProductRepo } from './store-product.repo';
import { StoreProduct } from 'src/entities/store-product.entity';
import { StoreModule } from 'src/store/store.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product, StoreProduct]), StoreModule],
  controllers: [ProductsContoller],
  providers: [ProductService, ProductRepo, StoreProductRepo],
})
export class ProductsModule {}
