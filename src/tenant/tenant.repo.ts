import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tenant } from 'src/entities/tenant.entity';
import { Repository } from 'typeorm';
import { CreateTenantConfigDto, UpdateTenantConfigDto } from './dtos';

export class TenantRepo {
  constructor(@InjectRepository(Tenant) private repo: Repository<Tenant>) {}

  create(payload: CreateTenantConfigDto) {
    const tenant = this.repo.create(payload);
    return this.repo.save(tenant);
  }

  findAll() {
    return this.repo.find();
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id: id } });
  }

  async update(payload: UpdateTenantConfigDto): Promise<Tenant> {
    const config = await this.repo.find();

    if (!config) {
      throw new NotFoundException('Tenant not found');
    }

    const updatedTenant = this.repo.merge(config?.[0], payload);
    return this.repo.save(updatedTenant);
  }

  remove(id: number) {
    if (!this.repo.findOneBy({ id: id })) {
      throw new NotFoundException('Tenant not found');
    }
    return this.repo.delete({ id: id });
  }
}
