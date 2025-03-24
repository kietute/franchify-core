import { PaymentMethod } from '@/dtos/order.dto';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'boolean', default: false })
  isSuccess: boolean;

  @Column({ type: 'jsonb' })
  paymentInfo: IVnpayResponse;

  @Column({ type: 'number' })
  orderId: number;
}

interface IVnpayResponse {
  amount: string;
  bankCode: string;
  bankTranNo: string;
  cardType: string;
  orderInfo: string;
  payDate: string;
  responseCode: string;
  tmnCode: string;
  transactionNo: string;
  transactionStatus: string;
  txnRef: string;
  secureHash: string;
}
