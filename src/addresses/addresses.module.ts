import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from 'src/entities/address.entity';
import { AddressRepo } from './address.repo';
import { AddressService } from './addresses.service';
import { AddressController } from './addresses.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Address])],
  providers: [AddressRepo, AddressService],
  controllers: [AddressController],
  exports: [AddressRepo, AddressService],
})
export class AddressModule {}
