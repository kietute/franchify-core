import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from 'src/entities/store.entity';
import { StoreRepo } from './store.repo';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';

@Module({
  imports: [TypeOrmModule.forFeature([Store])],
  providers: [StoreRepo, StoreService],
  exports: [StoreRepo],
  controllers: [StoreController],
})
export class StoreModule {}
