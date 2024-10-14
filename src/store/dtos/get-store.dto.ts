import { IsOptional, IsString, IsNumber, Min } from 'class-validator';

export class GetStoreDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  pageSize?: number;

  @IsOptional()
  @IsString()
  currentLng?: string;

  @IsOptional()
  @IsString()
  currentLat?: string;
}
