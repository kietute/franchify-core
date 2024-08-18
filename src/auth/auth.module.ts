import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { AuthService } from './auth.service';
import { CurrentUserMiddleware } from './middlewares/current-user.middleware';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), NotificationModule],
  controllers: [AuthController],
  providers: [UsersService, AuthService],
})
export class AuthModule {
  configure(consumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes('*');
  }
}
