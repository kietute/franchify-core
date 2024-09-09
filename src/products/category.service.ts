import { Injectable } from '@nestjs/common';
import { CategoryRepo } from './category.repo';
import { GetCategoryDto } from './dtos/get-category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepo: CategoryRepo) {}

  async createCategory(payload: any) {
    const category = await this.categoryRepo.create(payload);
    return category;
  }

  async getCategories(params: GetCategoryDto) {
    const categories = await this.categoryRepo.findAll(params);
    return categories;
  }
}
