import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class ForgotPassWordDto {
  @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
  @IsPhoneNumber('VN', { message: 'Số điện thoại không đúng định dạng' })
  phoneNumber: string;
}

export interface IForgotPasswordPayload {
  phoneNumber: string;
}
