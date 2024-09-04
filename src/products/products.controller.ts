import { Body, Controller, Post, UseGuards, Put } from '@nestjs/common';
import { CreateProductDto } from './dtos/create-product.dto';
import { ProductService } from './products.service';
import { StaffGuard } from 'src/common/guards/staff.guard';
import { LinkProductDto } from './dtos/link-product.dto';

@Controller('/products')
export class ProductsContoller {
  constructor(private productService: ProductService) {}

  @UseGuards(StaffGuard)
  @Post('/')
  async createProduct(@Body() body: CreateProductDto) {
    const product = await this.productService.createProduct(body);
    return product;
  }


  @UseGuards(StaffGuard)
  @Post('/link')
  async linkProductToStore(@Body() body: LinkProductDto) {
    const storeProduct = await this.productService.linkProductToStore(body);
    return storeProduct;
  }
}
