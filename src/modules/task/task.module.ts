import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { BullModule } from '@nestjs/bullmq';
import { join } from 'path';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'taskQueue',
      processors: [join(process.cwd(), 'processor.js')],
    }),
  ],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}
