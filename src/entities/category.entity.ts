import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from './product.entity';

enum CategoryPropertyType {
  number = 'number',
  boolean = 'boolean',
  text = 'string',
}

interface ICategoryProperty {
  name: string;
  type: CategoryPropertyType;
  options?: Array<CategoryPropertyType>;
}

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'jsonb' })
  property: ICategoryProperty[];

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
