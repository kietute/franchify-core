import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Tên người dùng không được để trống' })
  @IsString()
  username: string;

  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  email: string;

  @IsPhoneNumber('VN', { message: 'Số điện thoại không đúng định dạng' })
  @IsNotEmpty({ message: 'Số điện thoại không đuợc để trống' })
  phoneNumber: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  @IsNotEmpty({ message: 'Vai trò không được để trống' })
  role: string;

  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @IsString({ message: 'Mật khẩu phải là một chuỗi' })
  password: string;
}

export interface ICreateUserPayload {
  username: string;
  email: string;
  phoneNumber: string;
  firstName?: string;
  lastName?: string;
  role: string;
  password: string;
}
