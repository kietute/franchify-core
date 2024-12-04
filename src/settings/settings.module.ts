import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Settings } from '../entities/setting.entity';
import { SettingsRepo } from './settings.repo';

@Module({
  imports: [TypeOrmModule.forFeature([Settings])],
  providers:[SettingsRepo],
  exports: [],
  controllers: [],
})
export class SettingsModule {}
