import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class SignInStaffDto {
  @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
  @IsPhoneNumber('VN', { message: 'Số điện thoại không đúng định dạng' })
  phoneNumber: string;

  @IsString({ message: 'Mật khẩu phải là một chuỗi' })
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  password: string;
}

export interface ISignInStaffPayload {
  phoneNumber: string;
  password: string;
}
