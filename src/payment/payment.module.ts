import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { AuthModule } from '@/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenant } from '@/entities/tenant.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { VnpayModule, VnpayService } from 'nestjs-vnpay';
import { ignoreLogger } from 'vnpay';
import { PaymentService } from './payment.service';

@Module({
  imports: [
    VnpayModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secureSecret: configService.getOrThrow<string>('VNPAY_SECURE_SECRET'),
        tmnCode: configService.getOrThrow<string>('VNPAY_TMN_CODE'),
        loggerFn: ignoreLogger,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [PaymentController],
  providers: [ConfigService, PaymentService],
})
export class PaymentModule {}
