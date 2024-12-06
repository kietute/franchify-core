import { Injectable } from '@nestjs/common';
import { SettingsRepo } from './settings.repo';

@Injectable()
export class SettingsService {
  constructor(private readonly settingRepo: SettingsRepo) {
  }

  getAllSettings(){
    return 'All settings';
  }
}
