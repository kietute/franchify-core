import { Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Address } from './address.entity';
import { StoreProduct } from './store-product.entity';
import { User } from './user.entity';

@Entity()
export class Store {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Address, (address) => address.store)
  address: Address;

  @OneToMany(() => StoreProduct, (storeProduct) => storeProduct.store)
  storeProducts: StoreProduct[];

  @OneToMany(() => User, (user) => user.store)
  staffs: User[];
}
