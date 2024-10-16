import {
  Controller,
  Post,
  Get,
  Param,
  Patch,
  Delete,
  Body,
  Query,
} from '@nestjs/common';
import { CreateAddressDto } from './dtos/create-address.dto';
import { UpdateAddressDto } from './dtos/update-address.dto';
import { GetAddressDto } from './dtos/get-address.dto';
import { AddressService } from './addresses.service';

@Controller('/address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post('/')
  async createAddress(@Body() body: CreateAddressDto) {
    return this.addressService.createAddress(body);
  }

  @Get('/')
  async getAddresses(@Query() query: GetAddressDto) {
    return this.addressService.getAddresses(query);
  }

  @Get('/:id')
  async getAddressById(@Param('id') id: number) {
    return this.addressService.getAddressById(id);
  }

  @Patch('/:id')
  async updateAddress(@Param('id') id: number, @Body() body: UpdateAddressDto) {
    return this.addressService.updateAddress(id, body);
  }

  @Delete('/:id')
  async removeAddress(@Param('id') id: number) {
    return this.addressService.removeAddress(id);
  }
}
