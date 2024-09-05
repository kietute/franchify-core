export interface GetStoreProductsParam {
  storeId: number;
  name?: string;
  minPrice?: number;
  maxPrice?: number;
  category?: string;
  page?: number;
  pageSize?: number;
}
