import {
  IsArray,
  IsEmail,
  IsNumber,
  IsObject,
  IsOptional,
  IsPhoneNumber,
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

export class CreateOrderUserInfoDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  @IsPhoneNumber()
  phoneNumber: string;

  @IsString()
  @IsEmail()
  email: string;
}

export class CreateOrderDto {
  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderAddressDto)
  orderAddress: CreateOrderAddressDto;

  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderAddressDto)
  orderUserInfo: CreateOrderUserInfoDto;
}

export class UpdateOrderStatusDto {
  @IsString()
  status: string;
}
