import { PaymentMethod } from '@/dtos/order.dto';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: PaymentMethod, default: PaymentMethod.COD })
  paymentMethod: PaymentMethod;

  @Column({ nullable: false, type: 'string' })
  paymentUrl: string;

  @OneToOne(() => Order, { cascade: true })
  order: Order;
}
