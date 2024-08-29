import { Injectable, NotFoundException } from '@nestjs/common';
import { scrypt as _script } from 'crypto';
import axios from 'axios';
import { ISendOtpPayload } from './dtos/send-otp.dto';
import { NotificationService } from './notification.service';
import { IVerifyOtpPayload } from './dtos/verify-otp.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OtpService {
  constructor(
    private notificationService: NotificationService,
    private configService: ConfigService,
  ) {}

  //Void function
  async sendOtpCode(payload: ISendOtpPayload): Promise<boolean> {
    const { phoneNumber } = payload;

    const [findedOtp] = await this.notificationService.find(phoneNumber);
    if (!!findedOtp) {
      let createdDate = new Date(findedOtp.created_at);
      const distance = Date.now() - createdDate.getTime();
      console.log('distance is', distance);
      if (distance < 600000) {
        return true;
      }
    }
    try {
      const response = await axios.post(
        this.configService.get<string>('THIRD_PARTY_SEND_OTP_END_POINT'),
        new URLSearchParams({
          To: `${phoneNumber}`,
          Channel: 'sms',
        }),
        {
          auth: {
            username: `${this.configService.get<string>('THIRD_PARTY_SMS_USER')}`,
            password: `${this.configService.get<string>('THIRD_PARTY_SMS_PASSWORD')}`,
          },
        },
      );
      if (response) {
        await this.notificationService.create({
          phoneNumber: phoneNumber,
          url: response?.data?.url,
        });
        return true;
      }
    } catch (error) {
      throw error;
    }
  }

  async verifyOtpCode(payload: IVerifyOtpPayload): Promise<boolean> {
    const { phoneNumber, otpCode } = payload;
    const [findedOtp] = await this.notificationService.find(phoneNumber);

    if (!findedOtp) {
      throw new NotFoundException('Số điện thoại này chưa được gửi mã OTP nào');
    }
    try {
      const response = await axios.post(
        this.configService.get<string>('THIRD_PARTY_VERIFY_OTP_END_POINT'),
        new URLSearchParams({
          To: `${phoneNumber}`,
          Code: `${otpCode}`,
        }),
        {
          auth: {
            username: `${this.configService.get<string>('THIRD_PARTY_SMS_USER')}`,
            password: `${this.configService.get<string>('THIRD_PARTY_SMS_PASSWORD')}`,
          },
        },
      );

      if (response?.data?.valid) {
        await this.notificationService.remove(findedOtp.id);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      throw error;
    }
  }
}
