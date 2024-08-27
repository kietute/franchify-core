import { Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Address } from './address.entity';

@Entity()
export class Store {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Address, (address) => address.store)
  address: Address;
}
