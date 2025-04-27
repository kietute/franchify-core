import { IsOptional, IsNumber, Min, IsString, IsArray } from 'class-validator';
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
  @IsString()
  @IsOptional()
  storeId?: string;

  @IsArray()
  @IsOptional()
  categories?: string[];

  @IsOptional()
  @IsString()
  keyword: string;

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

  @IsOptional()
  @IsArray()
  category?: string[];

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

export class GetProductDetailDto {
  @Type(() => Number)
  @IsNumber()
  storeId: number;

  @IsString()
  @Type(() => String)
  upc?: string;
}
