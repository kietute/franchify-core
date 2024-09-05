import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateStoreDto } from './dtos/create-store.dto';
import { StoreService } from './store.service';
import { StaffGuard } from 'src/common/guards/staff.guard';

@UseGuards(StaffGuard)
@Controller('/store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post('/')
  async createUser(@Body() body: CreateStoreDto) {
    const store = await this.storeService.createStore(body);
    return store;
  }
}
