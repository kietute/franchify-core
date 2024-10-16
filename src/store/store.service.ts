import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
  UseGuards,
} from '@nestjs/common';
import { StoreRepo } from './store.repo';
import { CreateStoreDto } from './dtos/create-store.dto';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { Store } from '../entities/store.entity';
import { GetStoreDto } from './dtos/get-store.dto';
import { UpdateStoreDto } from './dtos/update-store.dto';
import { DeleteResult } from 'typeorm';
import { AddressService } from '../addresses/addresses.service'; // Nhập AddressService

@UseGuards(AdminGuard)
@Injectable()
export class StoreService {
  constructor(
    private readonly storeRepo: StoreRepo,
    private readonly addressService: AddressService, // Inject AddressService
  ) {}

  async createStore(payload: CreateStoreDto) {
    try {
      let savedAddress = null;

      // Kiểm tra xem có địa chỉ trong payload không
      if (payload.address) {
        savedAddress = await this.addressService.createAddress(payload.address);
        console.log('Saved Address:', savedAddress); // Kiểm tra giá trị trả về
      }

      // Tạo store mới mà không bao gồm address
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { address, ...storeData } = payload; // Tách địa chỉ ra khỏi payload
      const store = this.storeRepo.create(storeData); // Tạo store với dữ liệu còn lại

      // Gán địa chỉ đã lưu vào store nếu có
      if (savedAddress) {
        (await store).address = savedAddress; // Gán địa chỉ cho store
      }

      // Lưu store vào repo
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
    Object.assign(store, payload);
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
