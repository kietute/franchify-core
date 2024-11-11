import {
  IsArray,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class OrderProductDto {
  @IsNumber()
  productId: number;

  @IsNumber()
  quantity: number;
}

export class CreateOrderAddressDto {
  @IsString()
  address: string;

  @IsString()
  province: string;

  @IsOptional()
  @IsString()
  district?: string;

  @IsOptional()
  @IsString()
  ward?: string;

  @IsNumber()
  shippingFee: number;
}

export class CreateOrderDto {
  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderAddressDto)
  orderAddress: CreateOrderAddressDto;
}

export class UpdateOrderStatusDto {
  @IsString()
  status: string;
}
