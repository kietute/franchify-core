import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateStoreDto {
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

  @IsNumber()
  @IsOptional()
  lng: number;

  @IsOptional()
  @IsNumber()
  lat: number;

  @IsOptional()
  @IsArray()
  staffs: number[];
}
