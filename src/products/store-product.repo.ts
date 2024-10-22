import { Injectable } from '@nestjs/common';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { StoreProduct } from 'src/entities/store-product.entity';
import { GetStoreProductDto } from './dtos/get-product.dto';

@Injectable()
export class StoreProductRepo {
  constructor(
    @InjectRepository(StoreProduct)
    private readonly repo: Repository<StoreProduct>,
  ) {}

  private applyFilters(
    queryBuilder: SelectQueryBuilder<StoreProduct>,
    params: any,
  ): void {
    const { keyword, storeId, name, categoryId } = params;

    queryBuilder.andWhere('store_id = :storeId', {
      storeId: storeId,
    });

    // queryBuilder.leftJoinAndSelect('store_product.product', 'product');

    if (name) {
      queryBuilder.andWhere('name LIKE :name', {
        name: `%${name}%`,
      });
    }

    if (keyword) {
      queryBuilder.andWhere(
        '(name LIKE :keyword OR description LIKE :keyword OR other_field LIKE :keyword)',
        {
          keyword: `%${keyword}%`,
        },
      );
    }

    // if (categoryId) {
    //   queryBuilder.andWhere('product.categoryId = :categoryId', {
    //     categoryId: categoryId,
    //   });
    // }
  }

  async create(payload: any) {
    const product = this.repo.create(payload);
    return this.repo.save(product);
  }

  async findByUpc(payload: {
    upc: string;
    storeId: number;
  }): Promise<StoreProduct | undefined> {
    const { upc, storeId } = payload;
    const queryBuilder = this.repo
      .createQueryBuilder('store_product')
      .leftJoinAndSelect('store_product.product', 'product')
      .leftJoinAndSelect('store_product.store', 'store')
      .leftJoinAndSelect('product.category', 'category'); // Join the category table

    return queryBuilder
      .andWhere('product.upc = :upc', { upc })
      .andWhere('store.id = :storeId', { storeId })
      .getOne();
  }

  async getAll(params: GetStoreProductDto) {
    const queryBuilder = this.repo
      .createQueryBuilder('store_product')
      .leftJoinAndSelect('store_product.product', 'product');

    this.applyFilters(queryBuilder, params);

    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 10;
    const skip = (page - 1) * pageSize;

    const [results, total] = await queryBuilder
      .skip(skip)
      .take(pageSize)
      .getManyAndCount();

    return { results, total };
  }
}
