import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

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
}
