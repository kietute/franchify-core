import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Settings } from '../entities/setting.entity';



@Injectable()
export class SettingsRepo {
  constructor(@InjectRepository(Settings) private repo: Repository<Settings>) {
  }

  create(payload: any) {
    const settings = this.repo.create(payload as any);
    return this.repo.save(settings);
  }

  update(payload: any){
    return this.repo.save(payload);
  }
}