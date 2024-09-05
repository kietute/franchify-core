import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ProductRepo } from './products.repo';
import { CreateProductDto } from './dtos/create-product.dto';
import { LinkProductDto } from './dtos/link-product.dto';
import { StoreProductRepo } from './store-product.repo';

@Injectable()
export class ProductService {
  constructor(
    private readonly storeProductRepo: StoreProductRepo,
    private readonly productRepo: ProductRepo,
  ) {}

  async createProduct(payload: CreateProductDto) {
    try {
      const product = await this.productRepo.create(payload);

      if (!product) {
        throw new ServiceUnavailableException(
          'Cannot create product at the moment',
        );
      } else {
        return product;
      }
    } catch (error) {
      console.log(error);
      throw new ServiceUnavailableException('Internal server error');
    }
  }

  async linkProductsToStore(payload: LinkProductDto) {
    const { productIds, storeId } = payload;

    let listProducts = await this.productRepo.findByIds(productIds);
  }
}
