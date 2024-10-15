import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class ProductPriceDto {
  @IsNumber()
  price: number;

  @IsString()
  displayPrice: string;

  @IsOptional()
  @IsNumber()
  salePrice: number;

  @IsOptional()
  @IsString()
  displaySalePrice: string;
}

export class CreateProductDto {
  @IsString()
  upc: string;

  @IsString()
  name: string;

  @ValidateNested()
  @Type(() => ProductPriceDto)
  price: ProductPriceDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => Object)
  properties: { [key: string]: string | number | boolean };

  @IsOptional()
  @IsBoolean()
  isOnSale: boolean;

  @IsOptional()
  @IsString()
  fullDescription: string;

  @IsOptional()
  @IsString()
  shortDescription: string;

  @IsOptional()
  @IsString()
  nutritionInformations: string;

  @IsNumber()
  category: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsOptional()
  @IsString()
  thumbnail: string;
}

export class UpdateProductDto {
  @IsString()
  upc: string;

  @IsString()
  name: string;

  @IsOptional()
  properties: { [key: string]: string | number | boolean };

  @ValidateNested()
  @Type(() => ProductPriceDto)
  price: ProductPriceDto;

  @IsOptional()
  @IsBoolean()
  isOnSale: boolean;

  @IsOptional()
  @IsString()
  fullDescription: string;

  @IsOptional()
  @IsString()
  shortDescription: string;

  @IsOptional()
  @IsString()
  nutritionInformations: string;

  @IsNumber()
  category: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsOptional()
  @IsString()
  thumbnail: string;
}

export class BulkProductDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductDto)
  products: CreateProductDto[];
}
