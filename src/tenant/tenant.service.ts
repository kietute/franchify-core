import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Tenant } from 'src/entities/tenant.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(Tenant) private repo: Repository<Tenant>) {}

  findOne(id: number) {
    if (!id) {
      return null;
    }
    return this.repo.findOneBy({ id: id });
  }
}
