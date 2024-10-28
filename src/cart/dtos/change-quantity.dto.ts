// src/cart/dtos/change-quantity.dto.ts
import { IsInt, IsPositive } from 'class-validator';

export class ChangeQuantityDto {
  @IsInt()
  @IsPositive()
  quantity: number;

  @IsInt()
  @IsPositive()
  cartDetailId: number;
}
