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
      envFilePath:
        process.env.NODE_ENV !== 'production' ? `.env.development` : '.env',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          ssl: {
            rejectUnauthorized: false,
          },
          type: 'postgres',
          database: 'dbbg86lk3u0u2p',
          username: 'ufvol1ejnm7dki',
          password:
            'pa5de166e3c5abdbaa3b65494c4a7a11bdeaa82b027f2cdbe08c0b7da255ab667',
          host: 'cf980tnnkgv1bp.cluster-czrs8kj4isg7.us-east-1.rds.amazonaws.com',
          url: 'postgres://ufvol1ejnm7dki:pa5de166e3c5abdbaa3b65494c4a7a11bdeaa82b027f2cdbe08c0b7da255ab667@cf980tnnkgv1bp.cluster-czrs8kj4isg7.us-east-1.rds.amazonaws.com:5432/dbbg86lk3u0u2p',
          port: 5432,
          entities: [
            User,
            UserDevice,
            Address,
            Product,
            Category,
            Bid,
            OtpCode,
            Tenant,
            Store,
            StoreProduct,
          ],
          synchronize: process.env.NODE_ENV !== 'production',
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
