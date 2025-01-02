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
  UseInterceptors,
} from '@nestjs/common';
import {
  CreateProductDto,
  UpdateProductDto,
  UpdateStoreProductDto,
} from '@/dtos/product.dto';
import { ProductService } from './products.service';
import { StaffGuard } from '@/common/guards/staff.guard';
import { LinkProductDto } from '@/dtos/link-product.dto';
import { AdminGuard } from '@/common/guards/admin.guard';
import {
  GetProductDetailDto,
  GetStoreProductDto,
  GetTenentProductDto,
  SearchProductDto,
} from '@/dtos/get-product.dto';
import { Serialize } from '@/common/interceptors/serialize.interceptor';
import {
  CommentSerializer,
  CreateProductCommentDto,
  GetProductCommentsDto,
  ProductCommentSerializer,
} from '@/dtos/comment-product.dto';
import { CommentService } from './comment.service';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { AuthGuard } from '@/common/guards/auth.guard';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('/products')
// @UseInterceptors(CacheInterceptor)
export class ProductsController {
  constructor(
    private productService: ProductService,
    private commentService: CommentService,
  ) {}

  @UseGuards(AdminGuard)
  @Post('/')
  async createProduct(@Body() body: CreateProductDto) {
    return await this.productService.createProduct(body);
  }

  @UseGuards(AdminGuard)
  @Put('/:id')
  async updateProduct(@Param('id') id: string, @Body() body: UpdateProductDto) {
    return await this.productService.updateProduct(Number(id), body);
  }

  @UseGuards(StaffGuard)
  @Put('/:storeId/products/:upc')
  async updateStoreProduct(
    @Param('upc') upc: string,
    @Param('storeId') storeId: number,
    @Body() body: UpdateStoreProductDto,
  ) {
    return await this.productService.updateStoreProduct(upc, storeId, body);
  }

  @UseGuards(AdminGuard)
  @Delete('/:id')
  async deleteProduct(@Param('id') id: string) {
    return await this.productService.deleteProduct(Number(id));
  }

  @UseGuards(StaffGuard)
  @Get('/')
  async getAllProduct(@Query() queryParam: GetTenentProductDto) {
    return await this.productService.getTenantProducts(queryParam);
  }

  @Post('/search')
  async searchProduct(@Body() body: SearchProductDto) {
    return await this.productService.searchProduct(body);
  }

  @UseGuards(StaffGuard)
  @Post('/link-to-store')
  async linkProductToStore(@Body() body: LinkProductDto) {
    return await this.productService.linkProductsToStore(body);
  }

  // @UseInterceptors(CacheInterceptor)
  @Get('/by-store')
  async getProductsByStore(@Query() query: GetStoreProductDto) {
    return await this.productService.getStoreProducts(query);
  }

  @Get('/by-store/popular')
  async getProductsPopularByStore(@Query() query: GetStoreProductDto) {
    return await this.productService.getStoreProducts(query);
  }

  @Get('/detail')
  async getProductsByStoreId(@Query() query: GetProductDetailDto) {
    return await this.productService.getStoreProductById(query);
  }

  @Serialize(ProductCommentSerializer)
  @Get('/:id/comments')
  async getProductComments(@Param('id') id: string) {
    return await this.commentService.getByProductId({
      productId: Number(id),
    });
  }

  @UseGuards(AuthGuard)
  @Post('/comments')
  async commentOnProduct(
    @Body() body: CreateProductCommentDto,
    @CurrentUser() user,
  ) {
    return await this.commentService.createComment(body, user.id);
  }

  @Post('/clear-comments')
  async clearAllComments() {
    return await this.commentService.clearAllComments();
  }
}
