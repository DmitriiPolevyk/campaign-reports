import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskModule } from '../task/task.module';

@Module({
  imports: [ScheduleModule.forRoot(), TaskModule],
  providers: [CronService],
})
export class CronModule {}
