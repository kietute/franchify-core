import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class SignInUserDto {
  @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
  @IsPhoneNumber('VN', { message: 'Số điện thoại không đúng định dạng' })
  phoneNumber: string;

  @IsString({ message: 'Mật khẩu phải là một chuỗi' })
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  password: string;
}

export interface ISignInUserPayload {
  phoneNumber: string;
  password: string;
}
