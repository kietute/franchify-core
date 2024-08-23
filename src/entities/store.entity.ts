import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Address } from './address.entity';
import { TenantProduct } from './tenant-product.entity';

@Entity()
export class Store {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: number;

  @OneToOne(() => Address, (address) => address.store)
  address: Address;

  @OneToMany(() => TenantProduct, (storeProduct) => storeProduct.store)
  storeProducts: TenantProduct[];
}
