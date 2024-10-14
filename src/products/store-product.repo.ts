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
    const { keyword, storeId, name } = params;

    queryBuilder.andWhere('store_id = :storeId', {
      storeId: storeId,
    });

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
  }

  async create(payload: any) {
    const product = this.repo.create(payload);
    return this.repo.save(product);
  }

  async findById(id: number): Promise<StoreProduct | undefined> {
    return this.repo.findOne({ where: { id } });
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
