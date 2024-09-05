import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ProductRepo } from './products.repo';
import { CreateProductDto } from './dtos/create-product.dto';
import { LinkProductDto } from './dtos/link-product.dto';
import { StoreProductRepo } from './store-product.repo';
import { StoreRepo } from 'src/store/store.repo';

@Injectable()
export class ProductService {
  constructor(
    private readonly storeProductRepo: StoreProductRepo,
    private readonly productRepo: ProductRepo,
    private readonly storeRepo: StoreRepo,
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
    console.log('product ids is', productIds);

    let listProducts = await this.productRepo.findByIds(productIds);
    let store = await this.storeRepo.findById(storeId);

    if (!listProducts) {
      throw new ServiceUnavailableException('Cannot find products');
    }

    if (!store) {
      throw new ServiceUnavailableException('Cannot find store');
    }

    let storeProducts = [];

    for (let product of listProducts) {
      storeProducts.push({
        store: store,
        product: product,
        price: product.price,
        inventory: 100,
      });
    }

    try {
      const storeProduct = await this.storeProductRepo.create(storeProducts);
      if (!!storeProduct) {
        return storeProduct;
      } else {
        throw new ServiceUnavailableException(
          'Error linking products to store',
        );
      }
    } catch (error) {
      console.log('error linking products to store', error);
      throw new ServiceUnavailableException('Error linking products to store');
    }
  }
}
