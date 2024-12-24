import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Settings } from '@/entities/setting.entity';
import { SettingsRepo } from './settings.repo';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';

@Module({
  imports: [TypeOrmModule.forFeature([Settings])],
  providers:[SettingsRepo, SettingsService],
  exports: [],
  controllers: [SettingsController],
})
export class SettingsModule {}
