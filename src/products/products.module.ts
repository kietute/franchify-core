import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '@/entities/product.entity';
import { ProductsController } from './products.controller';
import { ProductService } from './products.service';
import { ProductRepo } from './products.repo';
import { StoreProductRepo } from './store-product.repo';
import { StoreProduct } from '@/entities/store-product.entity';
import { StoreModule } from '@/store/store.module';
import { Category } from '@/entities/category.entity';
import { CategoryRepo } from './category.repo';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { ElasticService } from './elastic.service';
import { CommentService } from './comment.service';
import { Comment } from '@/entities/comment.entity';
import { CommentRepo } from './comment.repo';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, StoreProduct, Category, Comment]),
    StoreModule,
  ],
  controllers: [ProductsController, CategoryController],
  providers: [
    ProductService,
    ProductRepo,
    StoreProductRepo,
    CategoryRepo,
    CategoryService,
    ElasticService,
    CommentService,
    CommentRepo,
  ],
  exports: [
    ProductService,
    ProductRepo,
    StoreProductRepo,
    CategoryService,
    CommentService,
  ],
})
export class ProductsModule {}
