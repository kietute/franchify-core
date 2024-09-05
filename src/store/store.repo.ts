import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from 'src/entities/store.entity';
import { CreateStoreDto } from './dtos/create-store.dto';

@Injectable()
export class StoreRepo {
  constructor(@InjectRepository(Store) private repo: Repository<Store>) {}

  create(payload: CreateStoreDto) {
    const store = this.repo.create(payload as any);
    return this.repo.save(store);
  }

  findById(id: number) {
    return this.repo.findOneBy({ id: id });
  }
}
