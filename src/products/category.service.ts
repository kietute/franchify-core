import { Injectable } from '@nestjs/common';
import { CategoryRepo } from './category.repo';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepo: CategoryRepo) {}

  async createCategory(payload: any) {
    const category = await this.categoryRepo.create(payload);
    return category;
  }
}
