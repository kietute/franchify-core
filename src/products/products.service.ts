import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ProductRepo } from './products.repo';
import {
  CreateProductDto,
  UpdateProductDto,
  UpdateStoreProductDto,
} from './dtos/product.dto';
import { LinkProductDto } from './dtos/link-product.dto';
import { StoreProductRepo } from './store-product.repo';
import { StoreRepo } from 'src/store/store.repo';
import {
  GetProductDetailDto,
  GetStoreProductDto,
  GetTenentProductDto,
  SearchProductDto,
} from './dtos/get-product.dto';
import { ElasticService } from './elastic.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly storeProductRepo: StoreProductRepo,
    private readonly productRepo: ProductRepo,
    private readonly storeRepo: StoreRepo,
    private readonly elasticService: ElasticService,
  ) {}

  async createProduct(payload: CreateProductDto) {
    try {
      const product = await this.productRepo.create(payload);
      if (!product) {
        throw new ServiceUnavailableException(
          'Cannot create product at the moment',
        );
      } else {
        const bulkResponse = await this.elasticService.bulk('products', [
          product as any,
        ]);
        if (!!bulkResponse?.data?.errors) {
          console.log('Error indexing product', bulkResponse.data);
        }

        return product;
      }
    } catch (error) {
      console.log(error);
      throw new ServiceUnavailableException('Internal server error');
    }
  }

  async updateProduct(id: number, payload: UpdateProductDto) {
    try {
      const updatedProduct = await this.productRepo.update(id, payload);
      if (!updatedProduct) {
        throw new ServiceUnavailableException(
          'Cannot update product at the moment',
        );
      } else {
        const bulkResponse = await this.elasticService.bulk('products', [
          updatedProduct as any,
        ]);
        if (!!bulkResponse?.data?.errors) {
          console.log('Error indexing product', bulkResponse.data);
        }
      }
      return updatedProduct;
    } catch (error) {
      console.log(error);
      throw new ServiceUnavailableException('Internal server error');
    }
  }

  async updateStoreProduct(
    upc: string,
    storeId: number,
    payload: UpdateStoreProductDto,
  ) {
    try {
      const updatedProduct = await this.storeProductRepo.update({
        storeId: storeId,
        upc: upc,
        payload: payload,
      });
      if (!updatedProduct) {
        throw new ServiceUnavailableException(
          'Cannot update store product at the moment',
        );
      } else {
        return updatedProduct;
      }
    } catch (error) {
      console.log(error);
      throw new ServiceUnavailableException('Internal server error');
    }
  }

  async deleteProduct(id: number) {
    try {
      const product = await this.productRepo.findOne(id);
      if (!product) {
        throw new NotFoundException('Product not found');
      } else {
        return this.productRepo.delete(id);
      }
    } catch (error) {
      console.log(error);
      throw new ServiceUnavailableException('Internal server error');
    }
  }

  async getTenantProducts(params: GetTenentProductDto) {
    try {
      const tenantProducts = await this.productRepo.findAll(params);
      if (!tenantProducts) {
        throw new NotFoundException('Cannot find tenant products');
      }
      return tenantProducts;
    } catch (error) {
      console.log('error getting store products', error);
      throw new ServiceUnavailableException('Error getting store products');
    }
  }

  async searchProduct(params: SearchProductDto) {
    try {
      const searchResults = await this.elasticService.search(params.keyword);
      if (searchResults?.data) {
        return searchResults?.data;
      } else {
        return [];
      }
    } catch (error) {
      throw new ServiceUnavailableException(
        'Cannot perform search at the moment',
      );
    }
  }

  async linkProductsToStore(payload: LinkProductDto) {
    const { productIds, storeId } = payload;

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

  async getStoreProducts(params: GetStoreProductDto) {
    try {
      const storeProducts = await this.storeProductRepo.getAll(params);
      if (!storeProducts) {
        throw new NotFoundException('Cannot find products');
      }
      return storeProducts;
    } catch (error) {
      console.log('error getting store products', error);
      throw new ServiceUnavailableException('Error getting store products');
    }
  }

  async getStoreProductById(payload: GetProductDetailDto) {
    try {
      const storeProduct = await this.storeProductRepo.findByUpc(
        payload as any,
      );
      if (!storeProduct) {
        throw new NotFoundException('Cannot find store product');
      } else {
        let relatedProducts = await this.getStoreProducts({
          storeId: storeProduct.store.id,
          category: storeProduct?.product?.category?.id,
        });
        return { storeProduct, relatedProducts: relatedProducts?.results };
      }
    } catch (error) {
      console.log('error getting store product', error);
      throw new ServiceUnavailableException('Error getting store product');
    }
  }

  async increaseByCount(payload: { id: number; count: number }) {
    try {
      const product = await this.productRepo.findOne(payload.id);
      if (!product) {
        throw new NotFoundException('Cannot find product');
      } else {
        await this.updateProduct(product?.id, {
          ...product,
          buyCount: product?.buyCount + payload.count,
        } as any);
      }
    } catch (error) {
      console.log('Update buy count error', error);
      throw new ServiceUnavailableException('Error update buy count');
    }
  }
}
