import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class SendOtpDto {
  @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
  @IsPhoneNumber('VN', { message: 'Số điện thoại không đúng định dạng' })
  phoneNumber: string;
}

export interface ISendOtpPayload {
  phoneNumber: string;
}
