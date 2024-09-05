import { Body, Controller, Post, UseGuards, Put } from '@nestjs/common';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { CategoryService } from './category.service';

@Controller('/category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @UseGuards(AdminGuard)
  @Post('/')
  async createCategory(@Body() body: CreateCategoryDto) {
    const category = await this.categoryService.createCategory(body);
    return category;
  }
}
