import {
  CreatePaymentRecordDto,
  CreatePaymentUrlDto,
} from '@/dtos/payment.dto';
import { Payment } from '@/entities/payment.entity';
import {
  Injectable,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { VnpayService } from 'nestjs-vnpay';
import { Repository } from 'typeorm';
import { dateFormat, ProductCode, VnpLocale } from 'vnpay';

@Injectable()
export class PaymentService {
  constructor(
    private vnpayService: VnpayService,
    @InjectRepository(Payment) private paymentRepo: Repository<Payment>,
    private configService: ConfigService,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  private toQueryString(payload: any): string {
    return new URLSearchParams(payload as Record<string, string>).toString();
  }

  async geVNPaytBankList() {
    return this.vnpayService.getBankList();
  }

  async createPaymentUrl(payload: CreatePaymentUrlDto) {
    const { amount, orderId } = payload;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    console.log('hello world', this.configService.get('CLIENT_HOST_URL'));

    const ipAddress =
      this.request.headers['x-forwarded-for'] ||
      this.request.connection.remoteAddress ||
      this.request.socket.remoteAddress ||
      (this.request.connection as any).socket.remoteAddress;

    try {
      const paymentUrl = this.vnpayService.buildPaymentUrl({
        vnp_Amount: amount,
        vnp_IpAddr: ipAddress || '13.160.92.202',
        vnp_TxnRef: orderId?.toString(),
        vnp_OrderInfo: `Payment for ${orderId}`,
        vnp_OrderType: ProductCode.Other,
        vnp_ReturnUrl: this.configService.get('CLIENT_HOST_URL'),
        vnp_Locale: VnpLocale.VN,
        vnp_CreateDate: dateFormat(new Date()),
        vnp_ExpireDate: dateFormat(tomorrow),
      });
      return paymentUrl;
    } catch (error) {
      console.log('Encounter error when try to create payment url', error);
    }
  }

  async verifyPayment(payload: any) {
    try {
      const { orderId } = payload || {};
      const paymentRecord = await this.paymentRepo.findOne({});
      if (paymentRecord?.id && paymentRecord.isSuccess) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      throw new InternalServerErrorException(
        'Server cannot verify the payment at the moment, please try later',
      );
    }
  }

  async createPaymentRecord(payload: CreatePaymentRecordDto) {
    try {
      const newPaymentRecord = await this.paymentRepo.create({
        isSuccess: payload.transactionStatus == '00',
        paymentInfo: {
          ...payload,
        },
      });
      return await this.paymentRepo.save(newPaymentRecord);
    } catch (error) {
      console.log('Server cannot save user order payment info', error);
    }
  }
}
