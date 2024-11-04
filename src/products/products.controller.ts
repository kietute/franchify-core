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
import {
  CreateProductDto,
  UpdateProductDto,
  UpdateStoreProductDto,
} from './dtos/product.dto';
import { ProductService } from './products.service';
import { StaffGuard } from 'src/common/guards/staff.guard';
import { LinkProductDto } from './dtos/link-product.dto';
import { AdminGuard } from 'src/common/guards/admin.guard';
import {
  GetProductDetailDto,
  GetStoreProductDto,
  GetTenentProductDto,
  SearchProductDto,
} from './dtos/get-product.dto';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import {
  CommentSerializer,
  CreateProductCommentDto,
  GetProductCommentsDto,
  ProductCommentSerializer,
} from './dtos/comment-product-dto';
import { CommentService } from './comment.service';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller('/products')
export class ProductsContoller {
  constructor(
    private productService: ProductService,
    private commentService: CommentService,
  ) {}

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

  @UseGuards(StaffGuard)
  @Put('/:storeId/products/:upc')
  async updateStoreProduct(
    @Param('upc') upc: string,
    @Param('storeId') storeId: number,
    @Body() body: UpdateStoreProductDto,
  ) {
    const product = await this.productService.updateStoreProduct(
      upc,
      storeId,
      body,
    );
    return product;
  }

  @UseGuards(AdminGuard)
  @Delete('/:id')
  async deleteProduct(@Param('id') id: string) {
    const product = await this.productService.deleteProduct(Number(id));
    return product;
  }

  @UseGuards(StaffGuard)
  @Get('/')
  async getAllProduct(@Query() queryParam: GetTenentProductDto) {
    const product = await this.productService.getTenantProducts(queryParam);
    return product;
  }

  @Post('/search')
  async searchProduct(@Body() body: SearchProductDto) {
    const products = await this.productService.searchProduct(body);
    return products;
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

  @Get('/by-store/popular')
  async getProductsPopularByStore(@Query() query: GetStoreProductDto) {
    const products = await this.productService.getStoreProducts(query);
    return products;
  }

  @Get('/detail')
  async getProductsByStoreId(@Query() query: GetProductDetailDto) {
    const products = await this.productService.getStoreProductById(query);
    return products;
  }

  @Serialize(ProductCommentSerializer)
  @Get('/:id/comments')
  async getProductComments(@Param('id') id: string) {
    const comments = await this.commentService.getByProductId({
      productId: Number(id),
    });
    return comments;
  }

  @UseGuards(AuthGuard)
  @Post('/comments')
  async commentOnProduct(
    @Body() body: CreateProductCommentDto,
    @CurrentUser() user,
  ) {
    const comments = await this.commentService.createComment(body, user.id);
    return comments;
  }

  @Post('/clear-comments')
  async clearAllComments() {
    const comments = await this.commentService.clearAllComments();
    return comments;
  }
}
