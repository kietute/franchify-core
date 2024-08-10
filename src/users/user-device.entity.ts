import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UserDevice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  device_token: string;

  @ManyToOne(() => User, (user) => user?.devices)
  user: User;
}
