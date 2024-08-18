import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtpCode } from '../entities/otp-code.dto';
import { NotificationService } from './notification.service';

@Module({
  providers: [OtpService, NotificationService],
  exports: [OtpService],
  imports: [TypeOrmModule.forFeature([OtpCode])],
})
export class NotificationModule {}
