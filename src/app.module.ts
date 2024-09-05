import { Module, MiddlewareConsumer, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { User } from './entities/user.entity';

import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { UserDevice } from './entities/user-device.entity';
import { AddressesModule } from './addresses/addresses.module';
import { Address } from './entities/address.entity';
import { ProductsModule } from './products/products.module';
import { Product } from './entities/product.entity';
import { Category } from './entities/category.entity';
import { Bid } from './entities/bid.entity';
import { ProductImage } from './entities/product-image';

import { NotificationModule } from './notification/notification.module';
import { OtpCode } from './entities/otp-code.dto';
import { Tenant } from './entities/tenant.entity';
import { TenantModule } from './tenant/tenant.module';
import { Store } from './entities/store.entity';
import { StoreProduct } from './entities/store-product.entity';
import { StoreModule } from './store/store.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.development`,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'postgres',
          database: config.get<string>('PROJECT_DB_NAME'),
          username: config.get<string>('PROJECT_DB_USER'),
          password: config.get<string>('PROJECT_DB_PASSWORD'),
          host: 'localhost',
          port: 5432,
          entities: [
            User,
            UserDevice,
            Address,
            Product,
            Category,
            Bid,
            ProductImage,
            OtpCode,
            Tenant,
            Store,
            StoreProduct,
          ],
          synchronize: true,
          namingStrategy: new SnakeNamingStrategy(),
        };
      },
    }),
    AuthModule,
    AddressesModule,
    ProductsModule,
    AuthModule,
    NotificationModule,
    TenantModule,
    StoreModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ whitelist: true }),
    },
  ],
})
export class AppModule {
  constructor(private configService: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {}
}
