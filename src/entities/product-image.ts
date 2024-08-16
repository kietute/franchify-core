import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class ProductImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  isThumbnail: boolean;

  @Column({ nullable: false })
  url: string;

  @ManyToOne(() => Product, (product) => product.images)
  product: Product;
}
