import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ReportsFetchDto } from './dto/reports-fetch.dto';
import { ReportsDto } from './dto/reports.dto';
import { TaskService } from '../task/task.service';

@ApiTags('reports')
@Controller('reports')
export class ReportsController {
  constructor(
    private reportsService: ReportsService,
    private taskService: TaskService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get aggregated reports' })
  @ApiResponse({
    status: 200,
    description: 'Aggregated reports',
    schema: {
      example: {
        data: [
          {
            ad_id: 1234,
            event_date: '2025-03-04',
            event_count: 123,
          },
        ],
        page: 1,
        take: 100,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    schema: {
      example: {
        statusCode: 400,
        message: ['string'],
        error: 'Bad Request',
      },
    },
  })
  async aggregateReportsData(@Query() aggregatedReportsDataPage: ReportsDto) {
    const { page, ...aggregatedReportsData } = aggregatedReportsDataPage;
    const { take } = aggregatedReportsData;

    const data = await this.reportsService.getAggregatedData({
      skip: (page - 1) * take,
      ...aggregatedReportsData,
    });
    return { data, page, take };
  }

  @Post()
  @ApiOperation({ summary: 'Init fetch' })
  @ApiResponse({
    status: 200,
    description: 'Init fetch',
    schema: {
      example: {
        ok: 'string',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    schema: {
      example: {
        statusCode: 400,
        message: ['string'],
        error: 'Bad Request',
      },
    },
  })
  async initFetch(@Body() initFetch: ReportsFetchDto) {
    await this.taskService.addTask({ manually: true, ...initFetch }, 1);
    return { ok: 'init fetch successfully' };
  }
}
