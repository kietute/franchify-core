import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateStoreDto } from '@/dtos/create-store.dto';
import { StoreService } from './store.service';
import { GetStoreDto } from '@/dtos/get-store.dto';
import { UpdateStoreDto } from '@/dtos/update-store.dto';

@Controller('/store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post('/')
  async createStore(@Body() body: CreateStoreDto) {
    return await this.storeService.createStore(body);
  }

  @Get('/')
  // @Serialize(StoreDto)
  async getStores(@Query() query: GetStoreDto) {
    return await this.storeService.getStores(query);
  }

  @Get('/:id')
  async getStoreById(@Param('id') id: number) {
    return await this.storeService.getStoreById(id);
  }

  @Patch('/:id')
  async updateStore(@Param('id') id: number, @Body() body: UpdateStoreDto) {
    return await this.storeService.update(id, body);
  }

  @Delete('/:id')
  async removeStore(@Param('id') id: number) {
    return this.storeService.remove(id);
  }
}
