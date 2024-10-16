import { Injectable, NotFoundException } from '@nestjs/common';
import { AddressRepo } from './address.repo';
import { CreateAddressDto } from './dtos/create-address.dto';
import { UpdateAddressDto } from './dtos/update-address.dto';
import { GetAddressDto } from './dtos/get-address.dto';
import { Address } from 'src/entities/address.entity';

@Injectable()
export class AddressService {
  constructor(private readonly addressRepo: AddressRepo) {}

  async createAddress(payload: CreateAddressDto): Promise<Address> {
    const address = this.addressRepo.create(payload); // Tạo một thực thể địa chỉ
    return await this.addressRepo.save(await address); // Lưu địa chỉ và trả về kết quả
  }

  async getAddresses(params: GetAddressDto): Promise<Address[]> {
    return this.addressRepo.findAll(params);
  }

  async getAddressById(id: number): Promise<Address> {
    const address = await this.addressRepo.findById(id);
    if (!address) {
      throw new NotFoundException('Address not found');
    }
    return address;
  }

  async updateAddress(id: number, payload: UpdateAddressDto): Promise<Address> {
    const address = await this.addressRepo.findById(id);
    if (!address) {
      throw new NotFoundException('Address not found');
    }
    Object.assign(address, payload);
    return this.addressRepo.save(address);
  }

  async removeAddress(id: number): Promise<void> {
    const address = await this.addressRepo.findById(id);
    if (!address) {
      throw new NotFoundException('Address not found');
    }
    await this.addressRepo.remove(id);
  }
}
