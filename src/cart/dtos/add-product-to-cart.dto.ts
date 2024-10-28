import { IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class AddProductToCartDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  cartId: number;

  @Type(() => Number)
  @IsNumber()
  productId: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  quantity: number;
}
