import { Injectable, NotFoundException } from '@nestjs/common';
import axios from 'axios';
import { ISendOtpPayload } from '@/dtos/send-otp.dto';
import { NotificationService } from './notification.service';
import { IVerifyOtpPayload } from '@/dtos/verify-otp.dto';
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

    const [code] = await this.notificationService.find(phoneNumber);
    if (!!code) {
      const createdDate = new Date(code.created_at);
      const distance = Date.now() - createdDate.getTime();
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
    const [code] = await this.notificationService.find(phoneNumber);

    if (!code) {
      throw new NotFoundException('This phone number has not been sent OTP');
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
        await this.notificationService.remove(code.id);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      throw error;
    }
  }
}
