import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { OrderDetail } from './order-detail.entity';

export interface IOrderAddress {
  address: string;
  province: string;
  district?: string;
  ward?: string;
  shippingFee: number;
}

export interface IOrderUserInfo {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
}

export enum OrderStatus {
  PENDING = 'pending',
  RECEIVED = 'received',
  PROCESSING = 'processing',
  SHIPPING = 'shipping',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn()
  user: User;

  @Column({ default: 'pending', type: 'enum', enum: OrderStatus })
  status: string;

  @Column({ type: 'jsonb', nullable: true })
  userInfo: IOrderUserInfo;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'jsonb' })
  orderAddress: IOrderAddress;

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.order, {
    cascade: true,
  })
  orderDetails: OrderDetail[];

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  totalAmount: number;
}
