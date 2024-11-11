import { Inject, Injectable, Module } from '@nestjs/common';
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
import { ElasticService } from './elastic.service';
import { CommentService } from './comment.service';
import { Comment } from 'src/entities/comment.entity';
import { CommentRepo } from './comment.repo';

@Module({
  imports: [
    // OpensearchModule.forRoot({
    //   node: 'https://yzcn37o1j:i4bnt5gp18@marketfloor-2626016716.us-east-1.bonsaisearch.net:443',
    //   maxRetries: 10,
    //   requestTimeout: 60000,
    //   pingTimeout: 60000,
    //   sniffOnStart: true,
    //   auth: {
    //     username: 'sQLdDWuC43',
    //     password: 'vZ6rCRuzKDLmH9cN',
    //   },
    // }),
    TypeOrmModule.forFeature([Product, StoreProduct, Category, Comment]),
    StoreModule,
  ],
  controllers: [ProductsContoller, CategoryController],
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
  exports: [ProductService, ProductRepo, StoreProductRepo, CategoryService],
})
export class ProductsModule {}
