import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtpCode } from '@/entities/otp-code.dto';
import { NotificationService } from './notification.service';

@Module({
  imports: [TypeOrmModule.forFeature([OtpCode])],
  providers: [OtpService, NotificationService],
  exports: [OtpService, NotificationService],
})
export class NotificationModule {}
