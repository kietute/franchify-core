import {
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MaxLength,
} from 'class-validator';

export class VerifyOtpDto {
  @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
  @IsPhoneNumber('VN', { message: 'Số điện thoại không đúng định dạng' })
  phoneNumber: string;

  @IsString({ message: 'OTP không đúng định dạng' })
  @MaxLength(6, { message: 'OTP phải có độ dài là 6' })
  otpCode: string;
}

export interface IVerifyOtpPayload {
  phoneNumber: string;
  otpCode: string;
}
