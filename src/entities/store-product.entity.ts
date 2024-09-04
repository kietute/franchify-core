import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  Unique,
} from 'typeorm';
import { Product } from './product.entity';
import { Store } from './store.entity';

@Entity()
@Unique(['product', 'store'])
export class StoreProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (product) => product.storeProducts)
  product: Product;

  @ManyToOne(() => Store, (store) => store.storeProducts)
  store: Store;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  inventory: number;
}
