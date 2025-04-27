import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '@/entities/product.entity';
import {
  CreateProductDto,
  UpdateProductDto,
  UpdateStoreProductDto,
} from '@/dtos/product.dto';
import { In } from 'typeorm';
import { GetTenentProductDto } from '@/dtos/get-product.dto';

@Injectable()
export class ProductRepo {
  constructor(@InjectRepository(Product) private repo: Repository<Product>) {}

  private applyFilters(
    queryBuilder: SelectQueryBuilder<Product>,
    params: any,
  ): void {
    if (params.name) {
      queryBuilder.andWhere('product.name LIKE :name', {
        name: `%${params.name}%`,
      });
    }
  }

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

  delete = (id: number) => {
    return this.repo.delete(id);
  };

  async findAll(params: any) {
    console.log('find all params', params);

    const queryBuilder = this.repo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category');

    // Apply filters
    if (params.categories && params.categories.length > 0) {
      queryBuilder.andWhere('category.id IN (:...categoryIds)', {
        categoryIds: params.categories,
      });
    }

    if (params.onSale == true) {
      queryBuilder.andWhere('product.isOnSale = :onSale', { onSale: true });
    }

    if (params?.keyword) {
      queryBuilder.andWhere('LOWER(product.name) LIKE LOWER(:keyword)', {
        keyword: `%${params.keyword}%`,
      });
    }

    this.applyFilters(queryBuilder, params);

    // Decide when to count based on filtered results
    const shouldUseFilteredProducts = params.onSale === true || params.keyword;

    const categoryMap = new Map();

    let productsForCategoryCount: any[];

    if (shouldUseFilteredProducts) {
      // Count categories based on filtered results
      productsForCategoryCount = await queryBuilder.getMany();
    } else {
      // Count categories based on all products
      const allProductsQuery = this.repo
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.category', 'category');
      productsForCategoryCount = await allProductsQuery.getMany();
    }

    // First collect all unique categories
    productsForCategoryCount.forEach((product) => {
      if (product.category) {
        const category = product.category;
        if (!categoryMap.has(category.id)) {
          categoryMap.set(category.id, {
            ...category,
            count: 0,
          });
        }
      }
    });

    // Then count occurrences
    productsForCategoryCount.forEach((product) => {
      if (product.category) {
        const category = product.category;
        const existing = categoryMap.get(category.id);
        if (existing) {
          existing.count++;
        }
      }
    });

    const categories = Array.from(categoryMap.values());

    // Keep your original pagination logic
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 20;
    const take = page * pageSize;

    queryBuilder.take(take);

    const [results, total] = await queryBuilder.getManyAndCount();

    const totalPage = Math.ceil(total / pageSize);

    return { results, total, totalPage, categories };
  }

  async search(keyword: string) {
    const keywordArr = keyword.toLowerCase().split(' ');

    const allProducts = await this.repo.find();
    return allProducts.filter((product) => {
      const productNameArr = product.name.toLowerCase().split(' ');
      return keywordArr.some((kw) => productNameArr.includes(kw));
    });
  }

  async update(id: number, attrs: UpdateProductDto) {
    const product = await this.findOne(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    Object.assign(product, attrs);
    return this.repo.save(product);
  }

  async updateBuyCount(id: number) {
    const product = await this.findOne(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    product.buyCount += 1;
    return this.repo.save(product);
  }

  remove(id: number) {
    if (!this.repo.findOneBy({ id: id })) {
      throw new NotFoundException('Product not found');
    }
    return this.repo.delete({ id: id });
  }
}
