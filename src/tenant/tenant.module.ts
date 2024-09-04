import { Module } from '@nestjs/common';
import { TenantController } from './tenant.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [TenantController],
  imports: [AuthModule],
})
export class TenantModule {}
