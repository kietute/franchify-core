import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { ProductImage } from './product-image';

interface IProductPrice {
  price: number;
  displayPrice: string;
  salePrice: number;
  displaySalePrice: string;
}

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  upc: string;

  @Column()
  name: string;

  @Column({ type: 'jsonb' })
  price: IProductPrice;

  @Column()
  displayPrice: string;

  @Column({ nullable: true })
  salePrice: number;

  @Column({ nullable: true })
  displaySalePrice: number;

  @Column({ default: false })
  isOnSale: boolean;

  @Column()
  description: string;

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;

  @OneToMany(() => ProductImage, (image) => image.product)
  images: ProductImage[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
