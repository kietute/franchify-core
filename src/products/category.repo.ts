import { Injectable } from '@nestjs/common';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/entities/category.entity';
import { GetCategoryDto } from './dtos/get-category.dto';

@Injectable()
export class CategoryRepo {
  constructor(@InjectRepository(Category) private repo: Repository<Category>) {}

  create(payload: any) {
    const category = this.repo.create(payload as any);
    return this.repo.save(category);
  }

  findById(id: number) {
    return this.repo.findOneBy({ id: id });
  }

  async findAll(
    params: GetCategoryDto,
  ): Promise<{ data: Category[]; total: number }> {
    const queryBuilder = this.repo.createQueryBuilder('category');

    if (params.name) {
      queryBuilder.andWhere('category.name LIKE :name', {
        name: `%${params.name}%`,
      });
    }

    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 10;
    const skip = (page - 1) * pageSize;

    const [data, total] = await queryBuilder
      .skip(skip)
      .take(pageSize)
      .getManyAndCount();

    return { data, total };
  }
}
