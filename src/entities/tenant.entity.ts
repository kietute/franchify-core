import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TenantProduct } from './tenant-product.entity';

@Entity()
export class Tenant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  companyLegalName: string;

  @OneToMany(() => TenantProduct, (tenantProduct) => tenantProduct.product)
  tenantProducts: TenantProduct[];
}
