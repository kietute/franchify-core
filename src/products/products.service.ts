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

    try {
      const storeProducts = productIds.map((productId) => ({
        product: { id: productId } as any, // Assuming productId is sufficient to reference the product
        store: { id: storeId } as any, // Assuming storeId is sufficient to reference the store
        price: 0, // You can adjust this if you want to pass different prices for each product
        inventory: 0, // Same for inventory
      }));

      await this.storeProductRepo.saveMany(storeProducts);

      return storeProducts;
    } catch (error) {
      console.log(error);
      throw new ServiceUnavailableException('Internal server error');
    }
  }
}
