import { IsNumber } from 'class-validator';

export class CreatePaymentUrlDto {
  @IsNumber({}, { message: 'Amount must be a number' })
  amount: number;

  @IsNumber({}, { message: 'Order Id không được để trống' })
  orderId: number;
}
