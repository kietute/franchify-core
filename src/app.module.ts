import { Module, MiddlewareConsumer, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { User } from './entities/user.entity';
import { Comment } from './entities/comment.entity';

import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { UserDevice } from './entities/user-device.entity';
import { ProductsModule } from './products/products.module';
import { Product } from './entities/product.entity';
import { Category } from './entities/category.entity';
import { Bid } from './entities/bid.entity';
import { Cart } from './entities/cart.entity';
import { CartDetail } from './entities/cartDetail.entity';
import { CartModule } from './cart/cart.module';

import { NotificationModule } from './notification/notification.module';
import { OtpCode } from './entities/otp-code.dto';
import { Tenant } from './entities/tenant.entity';
import { TenantModule } from './tenant/tenant.module';
import { Store } from './entities/store.entity';
import { StoreProduct } from './entities/store-product.entity';
import { StoreModule } from './store/store.module';
import { Order } from './entities/order.entity';
import { OrderDetail } from './entities/order-detail.entity';
import { OrderModule } from './order/order.module';
import { MailerModule } from '@nestjs-modules/mailer';
import {
  CacheInterceptor,
  CacheModule,
  CacheStore,
} from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { Settings } from './entities/setting.entity';
import { SettingsModule } from './settings/settings.module';

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
        if (process.env.NODE_ENV !== 'production') {
          return {
            ssl: {
              rejectUnauthorized: false,
            },
            type: 'postgres',
            database: config.get('PROJECT_DB_NAME'),
            username: config.get('PROJECT_DB_USER'),
            password: config.get('PROJECT_DB_PASSWORD'),
            host: config.get('PROJECT_DB_HOST'),
            port: config.get('PROJECT_DB_PORT'),
            entities: [
              User,
              UserDevice,
              Product,
              Category,
              Bid,
              OtpCode,
              Tenant,
              Store,
              StoreProduct,
              Cart,
              CartDetail,
              Comment,
              Order,
              OrderDetail,
            ],
            synchronize: true,
            namingStrategy: new SnakeNamingStrategy(),
          };
        }
        return {
          ssl: {
            rejectUnauthorized: false,
          },
          type: 'postgres',
          database: config.get('PROJECT_DB_NAME'),
          username: config.get('PROJECT_DB_USER'),
          password: config.get('PROJECT_DB_PASSWORD'),
          host: config.get('PROJECT_DB_HOST'),
          port: config.get('PROJECT_DB_PORT'),
          entities: [
            User,
            UserDevice,
            Product,
            Category,
            Bid,
            OtpCode,
            Tenant,
            Store,
            StoreProduct,
            Cart,
            CartDetail,
            Comment,
            Order,
            OrderDetail,
            Settings,
          ],
          synchronize: false,
          namingStrategy: new SnakeNamingStrategy(),
        };
      },
    }),
    AuthModule,
    ProductsModule,
    AuthModule,
    NotificationModule,
    TenantModule,
    StoreModule,
    CartModule,
    OrderModule,
    SettingsModule,
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
