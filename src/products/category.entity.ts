import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

enum CategoryPropertyType {
  number = 'number',
  boolean = 'boolean',
  text = 'string',
}

interface ICategoryProperty {
  name: string;
  type: CategoryPropertyType;
  options?: Array<CategoryPropertyType>;
}

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'jsonb' })
  property: ICategoryProperty[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
