import {
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
  UseGuards,
} from '@nestjs/common';
import { StoreRepo } from './store.repo';
import { CreateStoreDto } from '@/dtos/create-store.dto';
import { AdminGuard } from '@/common/guards/admin.guard';
import { Store } from '@/entities/store.entity';
import { GetStoreDto } from '@/dtos/get-store.dto';
import { UpdateStoreDto } from '@/dtos/update-store.dto';
import { DeleteResult } from 'typeorm';

@UseGuards(AdminGuard)
@Injectable()
export class StoreService {
  constructor(private readonly storeRepo: StoreRepo) {}

  async createStore(payload: CreateStoreDto) {
    try {
      const { ...storeData } = payload;
      const store = this.storeRepo.create(storeData);
      return await this.storeRepo.save(await store);
    } catch (error) {
      console.error('create store error', error);
      throw new ServiceUnavailableException('Internal server error');
    }
  }

  async getStores(
    params: GetStoreDto,
  ): Promise<{ results: Store[]; total: number }> {
    return this.storeRepo.findAll(params);
  }

  async getStoreById(id: number): Promise<Store> {
    const store = await this.storeRepo.findById(id);
    if (!store) {
      throw new NotFoundException('Store not found');
    }
    return store;
  }

  async update(id: number, payload: UpdateStoreDto): Promise<Store> {
    const store = await this.storeRepo.findById(id);
    if (!store) {
      throw new NotFoundException('Store not found');
    }
    Object.assign(store, { ...payload, staffs: [9] });
    return this.storeRepo.save(store);
  }

  async remove(id: number): Promise<DeleteResult> {
    const user = await this.storeRepo.findById(id);
    if (!user) {
      throw new NotFoundException('Store not found');
    }
    return this.storeRepo.remove(id);
  }
}
