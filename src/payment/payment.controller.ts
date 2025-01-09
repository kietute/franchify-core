import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Request,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentService } from './payment.service';
import { CreateVNPayUrlDto } from '@/dtos/payment.dto';

@Controller('payment')
export class PaymentController {
  constructor(
    private configService: ConfigService,
    private paymentService: PaymentService,
  ) {}

  @Post('/create-url')
  createPaymentUrl(@Body() body: CreateVNPayUrlDto) {
    return this.paymentService.createPaymentUrl(body);
  }

  @Get('/vnpay-bank-list')
  async getVNPayBankList() {
    return await this.paymentService.geVNPaytBankList();
  }

  @Get('/vnpay/callback')
  async vnpayCallback(@Req() req: Request, @Query() query: any) {
    return this.paymentService.verfiyVnPayPaymentCallback(query);
  }
}
