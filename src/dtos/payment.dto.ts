import { IsNumber, IsString, IsOptional, IsDateString } from 'class-validator';

export class CreatePaymentUrlDto {
  @IsNumber({}, { message: 'Amount must be a number' })
  amount: number;

  @IsNumber({}, { message: 'Order Id không được để trống' })
  orderId: number;
}

export class CreatePaymentRecordDto {
  @IsString({ message: 'Amount is required' })
  amount: string;

  @IsString({ message: 'Bank code is required' })
  bankCode: string;

  @IsOptional()
  @IsString({ message: 'Bank transaction number must be a string' })
  bankTranNo?: string;

  @IsOptional()
  @IsString({ message: 'Card type must be a string' })
  cardType?: string;

  @IsOptional()
  @IsString({ message: 'Order info must be a string' })
  orderInfo?: string;

  @IsOptional()
  @IsDateString({})
  payDate?: string;

  @IsOptional()
  @IsString({ message: 'Response code must be a string' })
  responseCode?: string;

  @IsOptional()
  @IsString({ message: 'Terminal code must be a string' })
  tmnCode?: string;

  @IsOptional()
  @IsString({ message: 'Transaction number must be a string' })
  transactionNo?: string;

  @IsOptional()
  @IsString({ message: 'Transaction status must be a string' })
  transactionStatus?: string;

  @IsOptional()
  @IsString({ message: 'Transaction reference must be a string' })
  txnRef?: string;

  @IsOptional()
  @IsString({ message: 'Secure hash must be a string' })
  secureHash?: string;
}
