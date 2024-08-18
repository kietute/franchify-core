import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from './category.entity';

@Entity()
export class Bid {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  description: string;

  @Column()
  priceStart: number;

  @Column()
  stepBid: number;

  @Column()
  priceWin: number;

  @Column()
  reservePrice: number;

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;
}
