import {
  Body,
  Controller,
  Post,
  UseGuards,
  Put,
  Get,
  Param,
  Query,
  Delete,
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

  @Put('/:id')
  async updateCategory(
    @Param('id') id: string,
    @Body() body: CreateCategoryDto,
  ) {
    const category = await this.categoryService.updateCategory(
      Number(id),
      body,
    );
    return category;
  }

  @Delete('/:id')
  async deleteCategory(@Param('id') id: string) {
    const category = await this.categoryService.deleteCategory(Number(id));
    return category;
  }

  @Get('/')
  async getCategories(@Query() query: GetCategoryDto) {
    const categories = await this.categoryService.getCategories(query);
    return categories;
  }
}
