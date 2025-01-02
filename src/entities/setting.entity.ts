import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';


interface IHeaderConfig {}

interface IFooterConfig {}

interface IHomePageConfig{
  slideshow: string[];
}

@Entity()
export class Settings{

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true, type: 'jsonb' })
  homePage: IHomePageConfig;

  @Column({ nullable: true, type: 'jsonb' })
  headerConfigs: IHeaderConfig;

  @Column({ nullable: true, type: 'jsonb' })
  footerConfigs: IFooterConfig;
}