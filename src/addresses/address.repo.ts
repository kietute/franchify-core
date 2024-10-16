import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from 'src/entities/address.entity';
import { CreateAddressDto } from './dtos/create-address.dto';
import { GetAddressDto } from './dtos/get-address.dto';

@Injectable()
export class AddressRepo {
  constructor(@InjectRepository(Address) private repo: Repository<Address>) {}

  create(payload: CreateAddressDto) {
    const address = this.repo.create(payload);
    return this.repo.save(address);
  }

  save(address: Address): Promise<Address> {
    return this.repo.save(address);
  }

  remove(id: number) {
    return this.repo.delete({ id });
  }

  findById(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  async findAll(params: GetAddressDto): Promise<Address[]> {
    const queryBuilder = this.repo.createQueryBuilder('address');

    if (params.city) {
      queryBuilder.andWhere('address.city = :city', { city: params.city });
    }

    if (params.state) {
      queryBuilder.andWhere('address.state = :state', { state: params.state });
    }

    if (params.country) {
      queryBuilder.andWhere('address.country = :country', {
        country: params.country,
      });
    }

    return queryBuilder.getMany();
  }
}
