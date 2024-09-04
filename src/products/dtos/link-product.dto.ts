import { IsNumber } from 'class-validator';

export class LinkProductDto {
  @IsNumber()
  productId: number;

  @IsNumber()
  storeId: number;
}
