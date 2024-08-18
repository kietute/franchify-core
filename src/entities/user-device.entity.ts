import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UserDevice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  deviceToken: string;

  @ManyToOne(() => User, (user) => user?.devices)
  user: User;
}
