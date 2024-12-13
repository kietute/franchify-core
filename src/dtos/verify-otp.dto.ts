import { IsNotEmpty, IsPhoneNumber, IsString, Max } from 'class-validator';

export class VerifyOtpDto {
  @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
  @IsPhoneNumber('VN', { message: 'Số điện thoại không đúng định dạng' })
  phoneNumber: string;

  @IsString({ message: 'OTP không đúng định dạng' })
  @Max(6, { message: 'OTP phải có độ dại là 6' })
  otpCode: string;
}

export interface IVerifyOtpPayload {
  phoneNumber: string;
  otpCode: string;
}
