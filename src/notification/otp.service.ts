import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from 'src/auth/users.service';
import { scrypt as _script } from 'crypto';
import axios from 'axios';
import { ISendOtpPayload } from './dtos/send-otp.dto';
import { OtpCode } from 'src/entities/otp-code.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    try {
      const response = await axios.post(
        this.configService.get<string>('THIRD_PARTY_SEND_OTP_END_POINT'),
        new URLSearchParams({
          To: `${phoneNumber}`,
          Channel: 'sms',
        }),
        {
          auth: {
            username: 'AC875f24bd1a1381faf981784e6e2b8d93',
            password: '97b6dc110217906fb0d92d5b7ead8ae1',
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
            username: 'AC875f24bd1a1381faf981784e6e2b8d93',
            password: '97b6dc110217906fb0d92d5b7ead8ae1',
          },
        },
      );

      if (response?.data?.valid) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      throw error;
    }
  }
}
