import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';


interface IHeaderConfig {}

interface IFooterConfig {}


@Entity()
export class Settings{

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true, type: 'jsonb' })
  homePageSlideshow: string[];

  @Column({ nullable: true, type: 'jsonb' })
  headerConfigs: IHeaderConfig;

  @Column({ nullable: true, type: 'jsonb' })
  footerConfigs: IFooterConfig;

}