import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  Unique,
} from 'typeorm';
import { IProductPrice, Product } from './product.entity';
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

  //price
  @Column({ type: 'jsonb' })
  price: IProductPrice;

  @Column()
  inventory: number;
}
