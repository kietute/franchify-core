import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  Unique,
} from 'typeorm';
import { Product } from './product.entity';
import { Store } from './store.entity';
import { Tenant } from './tenant.entity';

@Entity()
@Unique(['product', 'tenant'])
export class TenantProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (product) => product.tenantProducts)
  product: Product;

  @ManyToOne(() => Tenant, (tenant) => tenant.tenantProducts)
  store: Tenant;
}
