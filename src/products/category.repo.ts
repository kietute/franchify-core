import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/entities/category.entity';

@Injectable()
export class CategoryRepo {
  constructor(@InjectRepository(Category) private repo: Repository<Category>) {}

  create(payload: any) {
    const category = this.repo.create(payload as any);
    return this.repo.save(category);
  }

  findById(id: number) {
    return this.repo.findOneBy({ id: id });
  }
}
