import { Module } from '@nestjs/common';
import { TenantController } from './tenant.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TenantService } from './tenant.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

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
  ],
  providers: [TenantService],
})
export class TenantModule {}
