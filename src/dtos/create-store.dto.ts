import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateStoreDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsBoolean()
  @IsNotEmpty()
  supportPickup: boolean;

  @IsBoolean()
  @IsNotEmpty()
  supportDelivery: boolean;

  @IsNotEmpty()
  @IsNumber()
  openTime: number;

  @IsNotEmpty()
  @IsNumber()
  closeTime: number;

  @IsNotEmpty()
  @IsNumber()
  storeCode: number;


  @IsOptional()
  @IsNumber()
  lng: number;


  @IsOptional()
  @IsNumber()
  lat: number;



}
