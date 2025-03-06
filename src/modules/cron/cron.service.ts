import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TaskService } from '../task/task.service';
import { get24Range } from 'src/helpers/date';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);
  constructor(@Inject(TaskService) private taskService: TaskService) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleCron() {
    try {
      await this.taskService.addTask(get24Range(), 1);
    } catch (error) {
      this.logger.error({
        message: 'Error adding fetch-task to queue',
        error,
      });
    }
  }
}
