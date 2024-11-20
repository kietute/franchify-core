import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { UserDevice } from './user-device.entity';
import { Address } from './address.entity';
import { Store } from './store.entity';
import { Cart } from './cart.entity';
import { Comment } from './comment.entity';
import { Order } from './order.entity';

export enum UserRole {
  USER = 'user',
  STAFF = 'staff',
  MANAGER = 'manager',
  ADMIN = 'admin',
}

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({ unique: true })
  phoneNumber: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: 10, nullable: true })
  savePoints: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToOne(() => Cart, { cascade: true }) // Thêm giỏ hàng (Cart) nếu cần
  @JoinColumn()
  cart: Cart;

  @Column({ default: false })
  isVerified: boolean;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => UserDevice, (device) => device.user)
  devices: UserDevice[];

  @OneToMany(() => Address, (address) => address.user)
  addresses: Address[];

  @ManyToOne(() => Store, (store) => store.staffs)
  store: Store;

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Order, (order) => order.user, { cascade: true })
  orders: Order[];
}
