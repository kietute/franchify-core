import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class CreateUserDto {
  @IsPhoneNumber()
  @IsEmail()
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
