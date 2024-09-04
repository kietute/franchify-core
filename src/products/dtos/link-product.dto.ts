import { IsArray, IsNumber } from 'class-validator';

export class LinkProductDto {
  @IsNumber()
  @IsArray({ each: true })
  productIds: number[];

  @IsNumber()
  storeId: number;
}
