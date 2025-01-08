import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum PaymentMethod {
  COD = 'COD',
  MOMO = 'MOMO',
  VNPAY = 'VNPAY',
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
  @Type(() => CreateOrderUserInfoDto)
  orderUserInfo: CreateOrderUserInfoDto;

  @IsString()
  @IsOptional()
  paymentMethod: PaymentMethod;

  @IsNumber()
  storeId: number;
}

export class UpdateOrderStatusDto {
  @IsString()
  status: string;
}
