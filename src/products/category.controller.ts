import {
  Body,
  Controller,
  Post,
  UseGuards,
  Put,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { CategoryService } from './category.service';
import { GetCategoryDto } from './dtos/get-category.dto';

@UseGuards(AdminGuard)
@Controller('/category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Post('/')
  async createCategory(@Body() body: CreateCategoryDto) {
    const category = await this.categoryService.createCategory(body);
    return category;
  }

  @Get('/')
  async getCategories(@Query() query: GetCategoryDto) {
    const categories = await this.categoryService.getCategories(query);
    return categories;
  }
}
