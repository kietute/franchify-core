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
import { CreateProductDto, UpdateProductDto } from './dtos/create-product.dto';
import { ProductService } from './products.service';
import { StaffGuard } from 'src/common/guards/staff.guard';
import { LinkProductDto } from './dtos/link-product.dto';
import { AdminGuard } from 'src/common/guards/admin.guard';
import {
  GetStoreProductDto,
  GetTenentProductDto,
} from './dtos/get-product.dto';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';

@Controller('/products')
export class ProductsContoller {
  constructor(private productService: ProductService) {}

  @UseGuards(AdminGuard)
  @Post('/')
  async createProduct(@Body() body: CreateProductDto) {
    const product = await this.productService.createProduct(body);
    return product;
  }

  @UseGuards(AdminGuard)
  @Put('/:id')
  async updateProduct(@Param('id') id: string, @Body() body: UpdateProductDto) {
    const product = await this.productService.updateProduct(Number(id), body);
    return product;
  }

  @UseGuards(AdminGuard)
  @Delete('/:id')
  async deleteProduct(@Param('id') id: string) {
    const product = await this.productService.deleteProduct(Number(id));
    return product;
  }

  @UseGuards(AdminGuard)
  @Get('/')
  async getAllProduct(@Query() queryParam: GetTenentProductDto) {
    const product = await this.productService.getTenantProducts(queryParam);
    return product;
  }

  @UseGuards(StaffGuard)
  @Post('/link-to-store')
  async linkProductToStore(@Body() body: LinkProductDto) {
    const storeProduct = await this.productService.linkProductsToStore(body);
    return storeProduct;
  }

  @Get('/by-store')
  async getProductsByStore(@Query() query: GetStoreProductDto) {
    const products = await this.productService.getStoreProducts(query);
    return products;
  }
}
