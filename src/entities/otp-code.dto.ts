import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class OtpCode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  verifyUrl: string;

  @Column()
  phoneNumber: string;
}
