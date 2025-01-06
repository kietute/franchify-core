import { CreateVNPayUrlDto } from '@/dtos/payment.dto';
import { Injectable } from '@nestjs/common';
import { VnpayService } from 'nestjs-vnpay';
import { dateFormat, ProductCode, VnpLocale } from 'vnpay';

@Injectable()
export class PaymentService {
  constructor(private vnpayService: VnpayService) {}

  async geVNPaytBankList() {
    return this.vnpayService.getBankList();
  }

  async createPaymentUrl(payload: CreateVNPayUrlDto, ipAddress: string) {
    const { amount, orderId } = payload;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    try {
      const paymentUrl = this.vnpayService.buildPaymentUrl({
        vnp_Amount: amount,
        vnp_IpAddr: ipAddress || '13.160.92.202',
        //Order id
        vnp_TxnRef: orderId?.toString(),
        vnp_OrderInfo: `Thanh toan don hang ${orderId}`,
        vnp_OrderType: ProductCode.Other,
        vnp_ReturnUrl: 'http://localhost:3000/vnpay-return',
        vnp_Locale: VnpLocale.VN,
        vnp_CreateDate: dateFormat(new Date()),
        vnp_ExpireDate: dateFormat(tomorrow),
      });
      return paymentUrl;
    } catch (error) {
      console.log('error when try to create payment url', error);
    }
  }
}
