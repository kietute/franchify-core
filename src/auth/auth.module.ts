import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { AuthService } from './auth.service';
import { CurrentUserMiddleware } from './middlewares/current-user.middleware';
import { NotificationModule } from '../notification/notification.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    NotificationModule,
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
  controllers: [AuthController],
  providers: [UsersService, AuthService],
  exports: [UsersService, AuthService],
})
export class AuthModule {
  configure(consumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes('*');
  }
}
