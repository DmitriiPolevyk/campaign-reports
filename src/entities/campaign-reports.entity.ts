import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('campaign_reports')
export class CampaignReports extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  campaign: string;

  @Column('uuid')
  campaign_id: string;

  @Column('varchar')
  adgroup: string;

  @Column('uuid')
  adgroup_id: string;

  @Column('varchar')
  ad: string;

  @Column('uuid')
  ad_id: string;

  @Column('uuid')
  client_id: string;

  @Column('varchar')
  event_name: string;

  @Column('timestamp')
  event_time: Date;

  @CreateDateColumn()
  @Exclude()
  createdAt: Date;
}
