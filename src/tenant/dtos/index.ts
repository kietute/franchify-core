import { Expose, Exclude, Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
class StoreDto {
  @Expose()
  id: number;
}

export class TenantSignInReponseDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  phoneNumber: string;

  @Expose()
  username: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  role: string;

  @Expose()
  @Type(() => StoreDto)
  store: StoreDto;

  @Expose()
  addresses: Array<any>;

  @Expose()
  accessToken: string;

  @Expose()
  refreshToken: string;
}

export class CreateTenantConfigDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  fullDescription?: string;

  @IsOptional()
  @IsString()
  logoUrl?: string;

  @IsOptional()
  @IsString()
  slogan?: string;

  @IsNotEmpty()
  @IsString()
  companyPhoneNumber: string;

  @IsNotEmpty()
  @IsString()
  companyLegalName: string;

  @IsOptional()
  @IsString()
  primaryColorScheme?: string;
}

export class UpdateTenantConfigDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  fullDescription?: string;

  @IsOptional()
  @IsString()
  logoUrl?: string;

  @IsNotEmpty()
  @IsString()
  companyPhoneNumber: string;

  @IsNotEmpty()
  @IsString()
  companyLegalName: string;

  @IsOptional()
  @IsString()
  primaryColorScheme?: string;
}

export class SignInStaffDto {
  @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
  @IsPhoneNumber('VN', { message: 'Số điện thoại không đúng định dạng' })
  phoneNumber: string;

  @IsString({ message: 'Mật khẩu phải là một chuỗi' })
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  password: string;
}

export class CreateStaffDto {
  @IsNotEmpty({ message: 'Username cannot be empty' })
  @IsString()
  username: string;

  @IsNotEmpty({ message: 'Email cannot be empty' })
  @IsEmail({}, { message: 'Email not in the correct format' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Phone number cannot be empty' })
  phoneNumber: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsNotEmpty({ message: 'Password cannot be empty' })
  @IsString({ message: 'Password must be a string' })
  password: string;

  @IsString()
  role: string;

  @IsOptional()
  store: number;
}

//interface
export interface ISignInStaffPayload {
  phoneNumber: string;
  password: string;
}

export interface ICreateUserPayload {
  username: string;
  email: string;
  phoneNumber: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  password: string;
  isVerified?: boolean;
}
