import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Address } from './address.entity';
import { StoreProduct } from './store-product.entity';
import { User } from './user.entity';

@Entity()
export class Store {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true, nullable: true })
  storeCode: number;

  @Column({ nullable: true })
  supportDelivery: boolean;

  @Column({ nullable: true })
  supportPickup: boolean;

  @Column({ nullable: true })
  openTime: number;

  @Column({ nullable: true })
  closeTime: number;
  @Column({ nullable: true, type: 'float' })
  lng: number;

  @Column({ nullable: true, type: 'float' })
  lat: number;
  @OneToOne(() => Address)
  // @JoinColumn()
  address: Address;

  @OneToMany(() => StoreProduct, (storeProduct) => storeProduct.store)
  storeProducts: StoreProduct[];

  @OneToMany(() => User, (user) => user.store)
  staffs: User[];
}
