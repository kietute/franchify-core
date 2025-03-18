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
import { CreatePaymentUrlDto } from '@/dtos/payment.dto';

@Controller('payment')
export class PaymentController {
  constructor(
    private configService: ConfigService,
    private paymentService: PaymentService,
  ) {}

  @Post('/create-url')
  createPaymentUrl(@Body() body: CreatePaymentUrlDto) {
    return this.paymentService.createPaymentUrl(body);
  }

  @Get('/vnpay-bank-list')
  async getVNPayBankList() {
    return await this.paymentService.geVNPaytBankList();
  }

  @Post('/callback')
  async vnpayCallback(@Req() req: Request, @Body() payload) {
    return this.paymentService.verifyPayment(payload);
  }
}
