import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ForgotPassWordDto {
  @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
  @IsEmail({}, { message: 'Số điện thoại không đúng định dạng' })
  phoneNumber: string;

  @IsString({ message: 'Mật khẩu phải là một chuỗi' })
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  password: string;
}

export interface IForgotPasswordPayload {
  phoneNumber: string;
}
