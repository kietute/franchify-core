import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class CreateStaffDto {
  @IsNotEmpty({ message: 'Username cannot be empty' })
  @IsString()
  username: string;

  @IsNotEmpty({ message: 'Email cannot be empty' })
  @IsEmail({}, { message: 'Email not in the correct format' })
  email: string;

  @IsPhoneNumber('VN', { message: 'Wrong format for phone number' })
  @IsNotEmpty({ message: 'Phone number cannot be empty' })
  phoneNumber: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsNotEmpty({ message: 'Password cannot be empty' })
  @IsString({ message: 'Password must be a string' })
  password: string;
}

export interface ICreateStaffPayload {
  username: string;
  email: string;
  phoneNumber: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  password: string;
  isVerified?: boolean;
}
