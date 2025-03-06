import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { CampaignReports } from 'src/entities/campaign-reports.entity';
import { TaskModule } from '../task/task.module';

@Module({
  controllers: [ReportsController],
  imports: [TypeOrmModule.forFeature([CampaignReports]), TaskModule],
  providers: [ReportsService],
})
export class ReportsModule {}
