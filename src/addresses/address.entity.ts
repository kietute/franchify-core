import { Injectable } from '@nestjs/common';
import { User } from '../users/user.entity';
import { Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Injectable()
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  streetAddress: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  country: string;

  @Column()
  zipCode: string;

  @ManyToOne(() => User, (user) => user?.addresses)
  user: User;
}
