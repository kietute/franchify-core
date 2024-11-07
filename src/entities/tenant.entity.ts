import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Tenant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  companyPhoneNumber: string;

  @Column({ unique: true })
  companyLegalName: string;

  @Column({ nullable: true })
  logoUrl: string;

  @Column({ nullable: true, type: 'jsonb' })
  homePageSlideshow: string[];

  @Column({ nullable: false, default: '#008000' })
  primaryColorScheme: string;
}
