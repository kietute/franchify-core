import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { ProductImage } from './product-image';
import { StoreProduct } from './store-product.entity';

export interface IProductPrice {
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

  //price
  @Column({ type: 'jsonb' })
  price: IProductPrice;

  @Column({ default: false })
  isOnSale: boolean;

  @Column()
  fullDescription: string;

  @Column()
  shortDescription: string;

  @Column()
  nutritionInformations: string;

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;

  @OneToMany(() => ProductImage, (image) => image.product)
  images: ProductImage[];

  @OneToMany(() => StoreProduct, (storeProduct) => storeProduct.product)
  storeProducts: StoreProduct[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
