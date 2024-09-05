import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from './dtos/create-product.dto';
import { StoreProduct } from 'src/entities/store-product.entity';

@Injectable()
export class StoreProductRepo {
  constructor(
    @InjectRepository(StoreProduct) private repo: Repository<StoreProduct>,
  ) {}

  create(payload: CreateProductDto) {
    const product = this.repo.create(payload as any);
    return this.repo.save(product);
  }

  saveMany(storeProducts: Omit<StoreProduct, 'id'>[]) {
    return this.repo.save(storeProducts);
  }
}
