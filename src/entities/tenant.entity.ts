import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export interface ITenantSettings {
  carouselImages?: string[];
}

@Entity()
export class Tenant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true, default: '' })
  fullDescription: string;

  @Column({ nullable: true })
  slogan: string;

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

  @Column({ nullable: true, type: 'jsonb' })
  settings: ITenantSettings;
}
