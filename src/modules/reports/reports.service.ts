import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CampaignReports } from '../../entities/campaign-reports.entity';
import { ReportsPaginationDto } from './dto/reports.dto';

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);
  constructor(
    @InjectRepository(CampaignReports)
    private campaignReportRepository: Repository<CampaignReports>,
  ) {}

  async getAggregatedData(aggregatedReportsData: ReportsPaginationDto) {
    const { from_date, to_date, event_name, take, skip } =
      aggregatedReportsData;

    try {
      return await this.campaignReportRepository
        .createQueryBuilder('campaign-reports')
        .select(
          'campaign, campaign_id, adgroup, adgroup_id, ad, ad_id, event_name, COUNT(*) as event_count',
        )
        .where('event_name = :event_name', { event_name })
        .andWhere('event_time > :from_date', { from_date })
        .andWhere('event_time < :to_date', { to_date })
        .groupBy(
          'ad_id, event_name, campaign, campaign_id, adgroup, adgroup_id, ad',
        )
        .orderBy('event_count', 'DESC')
        .limit(take)
        .offset(skip)
        .execute();
    } catch (error) {
      this.logger.error({
        message: 'Error get aggregated data',
        error,
      });
      return [];
    }
  }
}
