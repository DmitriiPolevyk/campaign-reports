import * as dotenv from 'dotenv';
dotenv.config();
import { DataSource } from 'typeorm';
import { join } from 'path';
import { CampaignReports } from '../entities/campaign-reports.entity';

const ds = new DataSource({
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  type: 'postgres',
  entities: [CampaignReports],
  migrations: [join(process.cwd(), 'dist/db/migrations/**/*.js')],
  synchronize: false,
});

export const dataSource = ds;
