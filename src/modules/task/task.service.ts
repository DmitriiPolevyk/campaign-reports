import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { AddTaskDto } from './dto/add-task.dto';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);
  constructor(@InjectQueue('taskQueue') private taskQueue: Queue) {}

  async addTask(data: AddTaskDto, priority: number) {
    const job = await this.taskQueue.add('fetch-task', data, {
      priority,
      removeOnComplete: true,
    });

    this.logger.log({
      message: `${data.manually ? 'Manually' : 'Cron'} fetch-task added to queue`,
      id: job.id,
    });
  }
}
