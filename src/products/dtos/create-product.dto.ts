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

  @IsNumber()
  salePrice: number;

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

  @IsBoolean()
  isOnSale: boolean;

  @IsString()
  fullDescription: string;

  @IsString()
  shortDescription: string;

  @IsString()
  nutritionInformations: string;

  @IsNumber()
  cateogryId: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}
