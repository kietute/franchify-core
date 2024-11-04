import {
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { CategoryRepo } from './category.repo';
import { GetCategoryDto } from './dtos/get-category.dto';
import { UpdateCategoryDto } from './dtos/create-category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepo: CategoryRepo) {}

  async createCategory(payload: any) {
    const category = await this.categoryRepo.create(payload);
    return category;
  }

  async updateCategory(id: number, payload: UpdateCategoryDto) {
    const category = await this.categoryRepo.findById(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    try {
      const updatedCategory = Object.assign(category, payload);
      await this.categoryRepo.update(id, updatedCategory);
      return updatedCategory;
    } catch (error) {
      throw new ServiceUnavailableException('Update category failed');
    }
  }

  async deleteCategory(id: number) {
    const category = await this.categoryRepo.findById(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    await this.categoryRepo.delete(id);
    return category;
  }

  async getCategories(params: GetCategoryDto) {
    const categories = await this.categoryRepo.findAll(params);
    return categories;
  }
}
