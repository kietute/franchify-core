import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateAddressDto {
  @IsNotEmpty()
  @IsString()
  streetAddress: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  state: string;

  @IsNotEmpty()
  @IsString()
  country: string;

  @IsNotEmpty()
  @IsString()
  zipCode: string;
}
