import { Injectable } from '@nestjs/common';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { StoreProduct } from 'src/entities/store-product.entity';
import { GetProductDto } from './dtos/get-product.dto';

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
    queryBuilder.andWhere('store_id = :storeId', {
      storeId: params.storeId,
    });

    if (params.name) {
      queryBuilder.andWhere('name LIKE :name', {
        name: `%${params.name}%`,
      });
    }
  }

  async create(payload: any) {
    const product = this.repo.create(payload);
    return this.repo.save(product);
  }

  async findById(id: number): Promise<StoreProduct | undefined> {
    return this.repo.findOne({ where: { id } });
  }

  async getAll(params: GetProductDto) {
    const queryBuilder = this.repo.createQueryBuilder('store_product');

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
