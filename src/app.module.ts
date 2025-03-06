import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CronModule } from './modules/cron/cron.module';
import { ReportsModule } from './modules/reports/reports.module';
import { BullModule } from '@nestjs/bullmq';
import { TaskModule } from './modules/task/task.module';
import { LoggerModule } from 'nestjs-pino';
import { dataSource } from './db/data-source';
import logger from './helpers/logger';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async () => ({ pinoHttp: logger }),
      inject: [ConfigService],
    }),

    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        connection: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
        },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => ({}),
      dataSourceFactory: async () => {
        return await dataSource.initialize();
      },
      inject: [ConfigService],
    }),
    TaskModule,
    CronModule,
    ReportsModule,
  ],
})
export class AppModule {}
