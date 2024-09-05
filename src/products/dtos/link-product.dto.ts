import { IsArray, IsNumber } from 'class-validator';

export class LinkProductDto {
  @IsArray()
  @IsNumber(
    {},
    { each: true, message: 'productIds must be an array of numbers' },
  )
  productIds: number[];

  @IsNumber()
  storeId: number;
}
