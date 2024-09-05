import {
  Injectable,
  ServiceUnavailableException,
  UseGuards,
} from '@nestjs/common';
import { StoreRepo } from './store.repo';
import { CreateStoreDto } from './dtos/create-store.dto';
import { AdminGuard } from 'src/common/guards/admin.guard';

@UseGuards(AdminGuard)
@Injectable()
export class StoreService {
  constructor(private readonly storeRepo: StoreRepo) {}

  async createStore(payload: CreateStoreDto) {
    try {
      const store = await this.storeRepo.create(payload);
      if (!store) {
        console.log('error creating store', store);
        throw new ServiceUnavailableException(
          'Cannot create store at the moment',
        );
      } else {
        return store;
      }
    } catch (error) {
      console.log('creaate store error', error);
      throw new ServiceUnavailableException('Internal server error');
    }
  }
}
