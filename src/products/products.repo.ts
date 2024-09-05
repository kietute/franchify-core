import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/entities/product.entity';
import { CreateProductDto } from './dtos/create-product.dto';
import { In } from 'typeorm';

@Injectable()
export class ProductRepo {
  constructor(@InjectRepository(Product) private repo: Repository<Product>) {}

  create(payload: CreateProductDto) {
    const product = this.repo.create(payload as any);
    return this.repo.save(product);
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }
    return this.repo.findOneBy({ id: id });
  }

  find(name: string) {
    return this.repo.findBy({ name: name });
  }

  findByIds(ids: number[]) {
    return this.repo.find({ where: { id: In(ids) } });
  }

  async update(id: number, attrs: Partial<Product>) {
    const product = await this.findOne(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    Object.assign(product, attrs);
    return this.repo.save(product);
  }

  remove(id: number) {
    if (!this.repo.findOneBy({ id: id })) {
      throw new NotFoundException('Product not found');
    }
    return this.repo.delete({ id: id });
  }
}
