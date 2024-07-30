import { Controller, Get, Param } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get('planning-tasks')
  listCronJobs() {
    return this.tasksService.listOfPlanningTasks();
  }

  @Get('run-task-manually')
  runTaskManually() {
    this.tasksService.runTaskManually();
    return 'Tâche cron exécutée manuellement.';
  }

  @Get('task-status/:taskName')
  checkCronJobStatus(@Param('taskName') taskName: string) {
    return this.tasksService.checkTaskStatus(taskName);
  }
}
