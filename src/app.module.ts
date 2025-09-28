import { Module, MiddlewareConsumer, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { User } from './entities/user.entity';

import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { NotificationModule } from './notification/notification.module';
import { OtpCode } from './dtos/otp-code.dto';
import { MailerModule } from '@nestjs-modules/mailer';
import {
  CacheInterceptor,
  CacheModule,
  CacheStore,
} from '@nestjs/cache-manager';
import { PaymentModule } from './payment/payment.module';
import { UserDevice } from './entities/user-device.entity';
import { Payment } from './entities/payment.entity';
import { Notification } from './entities/notification.entity';
import { NotificationToken } from './entities/notificationToken.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV !== 'production'
          ? `.env.development`
          : '.env.production',
    }),
    // CacheModule.registerAsync({
    //   isGlobal: false,
    //   useFactory: async () => {
    //     const store = await redisStore({
    //       socket: {
    //         host: 'localhost',
    //         port: 6379,
    //       },
    //     });
    //     return {
    //       store: store as unknown as CacheStore,
    //       ttl: 3 * 60000,
    //     };
    //   },
    // }),
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          auth: {
            user: config.get('MAILDEV_INCOMING_USER'),
            pass: config.get('MAILDEV_INCOMING_PASSWORD'),
          },
          tls: {
            rejectUnauthorized: false,
          },
        },
        defaults: {
          from: config.get('MAILER_DEFAULT_FROM'),
        },
      }),
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          ssl: false,
          type: 'postgres',
          database: config.get('PROJECT_DB_NAME'),
          username: config.get('PROJECT_DB_USER'),
          password: config.get('PROJECT_DB_PASSWORD'),
          host: config.get('PROJECT_DB_HOST'),
          port: config.get('PROJECT_DB_PORT'),
          entities: [
            User,
            OtpCode,
            UserDevice,
            Payment,
            Notification,
            NotificationToken,
          ],
          synchronize: config.get('NODE_ENV') !== 'production',
          namingStrategy: new SnakeNamingStrategy(),
        };
      },
    }),
    AuthModule,
    NotificationModule,
    PaymentModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ whitelist: true }),
    },
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: CacheInterceptor,
    // },
  ],
})
export class AppModule {
  constructor(private configService: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {}
}
