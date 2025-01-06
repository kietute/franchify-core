import { Body, Controller, Get, Post, Req, Request } from '@nestjs/common';
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
  createPaymentUrl(@Body() body: CreateVNPayUrlDto, @Req() request: Request) {
    const ipAddress =
      request.headers['x-forwarded-for'] ||
      (request as any).connection.remoteAddress;
    return this.paymentService.createPaymentUrl(body, ipAddress);
  }

  @Get('/vnpay-bank-list')
  async getVNPayBankList() {
    return await this.paymentService.geVNPaytBankList();
  }
}
