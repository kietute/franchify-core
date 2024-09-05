import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/entities/product.entity';
import { ProductsContoller } from './products.controller';
import { ProductService } from './products.service';
import { ProductRepo } from './products.repo';
import { StoreProductRepo } from './store-product.repo';
import { StoreProduct } from 'src/entities/store-product.entity';
import { StoreModule } from 'src/store/store.module';
import { Category } from 'src/entities/category.entity';
import { CategoryRepo } from './category.repo';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, StoreProduct, Category]),
    StoreModule,
  ],
  controllers: [ProductsContoller, CategoryController],
  providers: [
    ProductService,
    ProductRepo,
    StoreProductRepo,
    CategoryRepo,
    CategoryService,
  ],
})
export class ProductsModule {}
