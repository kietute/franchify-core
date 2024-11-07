import { Module } from '@nestjs/common';
import { TenantController } from './tenant.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TenantService } from './tenant.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenant } from 'src/entities/tenant.entity';
import { TenantRepo } from './tenant.repo';

@Module({
  controllers: [TenantController],
  imports: [
    AuthModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        return {
          global: true,
          secret: config.get<string>('JWT_SECRET'),
        };
      },
    }),
    TypeOrmModule.forFeature([Tenant]),
  ],
  providers: [TenantService, TenantRepo],
})
export class TenantModule {}
