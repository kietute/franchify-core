import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { AuthModule } from '@/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenant } from '@/entities/tenant.entity';

@Module({
  controllers: [PaymentController],
  imports: [AuthModule, TypeOrmModule.forFeature([Tenant])],
})
export class PaymentModule {}
