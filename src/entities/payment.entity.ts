import { PaymentMethod } from '@/dtos/order.dto';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: PaymentMethod, default: PaymentMethod.COD })
  paymentMethod: PaymentMethod;

  @Column({ type: 'date' })
  paidDate: Date;

  @Column({ type: 'boolean' })
  isSuccess: boolean;

  @Column({ nullable: false, type: 'string' })
  paymentUrl: string;

  @Column({ type: 'jsonb' })
  otherInfo: any;

  @OneToOne(() => Order, { cascade: true })
  order: Order;
}
