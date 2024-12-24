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
import { AdminGuard } from '@/common/guards/admin.guard';
import { CreateCategoryDto } from '@/dtos/create-category.dto';
import { CategoryService } from './category.service';
import { GetCategoryDto } from '@/dtos/get-category.dto';

@Controller('/category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @UseGuards(AdminGuard)
  @Post('/')
  async createCategory(@Body() body: CreateCategoryDto) {
    return await this.categoryService.createCategory(body);
  }

  @UseGuards(AdminGuard)
  @Put('/:id')
  async updateCategory(
    @Param('id') id: string,
    @Body() body: CreateCategoryDto,
  ) {
    return await this.categoryService.updateCategory(Number(id), body);
  }

  @UseGuards(AdminGuard)
  @Delete('/:id')
  async deleteCategory(@Param('id') id: string) {
    return await this.categoryService.deleteCategory(Number(id));
  }

  @Get('/')
  async getCategories(@Query() query: GetCategoryDto) {
    return await this.categoryService.getCategories(query);
  }
}
