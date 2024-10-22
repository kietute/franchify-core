import { IsOptional, IsNumber, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class GetStoreProductDto {
  @Type(() => Number)
  @IsNumber()
  storeId: number;

  @IsOptional()
  @IsString()
  @Type(() => String)
  name?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  pageSize?: number;

  @IsOptional()
  @IsString()
  category?: number;
}

export class GetTenentProductDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  pageSize?: number;
}

export class SearchProductDto {
  @IsOptional()
  @IsString()
  keyword: string;
}

export class GetProductDetailDto {
  @Type(() => Number)
  @IsNumber()
  storeId: number;

  @IsString()
  @Type(() => String)
  upc?: string;
}
