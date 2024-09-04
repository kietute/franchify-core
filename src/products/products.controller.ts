import { Body, Controller, Post, UseGuards, Put } from '@nestjs/common';
import { CreateProductDto } from './dtos/create-product.dto';
import { ProductService } from './products.service';
import { StaffGuard } from 'src/common/guards/staff.guard';
import { LinkProductDto } from './dtos/link-product.dto';
import { AdminGuard } from 'src/common/guards/admin.guard';

@Controller('/products')
export class ProductsContoller {
  constructor(private productService: ProductService) {}

  @UseGuards(AdminGuard)
  @Post('/')
  async createProduct(@Body() body: CreateProductDto) {
    const product = await this.productService.createProduct(body);
    return product;
  }

  @UseGuards(StaffGuard)
  @Post('/link')
  async linkProductToStore(@Body() body: LinkProductDto) {
    const storeProduct = await this.productService.linkProductsToStore(body);
    return storeProduct;
  }
}
