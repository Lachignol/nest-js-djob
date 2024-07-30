import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { Rental } from 'src/entities/Rental.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Rental])],
  providers: [TasksService],
  controllers: [TasksController],
})
export class TasksModule {}
