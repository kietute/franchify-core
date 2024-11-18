import { Injectable, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from 'src/entities/store.entity';
import { StoreRepo } from './store.repo';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';
import { AddressService } from '../addresses/addresses.service';
import { AddressModule } from '../addresses/addresses.module';

@Module({
  imports: [TypeOrmModule.forFeature([Store]), AddressModule],
  providers: [StoreRepo, StoreService, AddressService],
  exports: [StoreRepo],
  controllers: [StoreController],
})
export class StoreModule {}
