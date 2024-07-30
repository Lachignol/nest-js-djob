import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { Customer } from './entities/Customer.entity';
import { Film } from './entities/Film.entity';
import { Rental } from './entities/Rental.entity';
import { CustomersController } from './customers/customers.controller';
import { FilmsController } from './films/films.controller';
import { RentalsController } from './rentals/rentals.controller';
import { CustomersService } from './customers/customers.service';
import { FilmsService } from './films/films.service';
import { RentalsService } from './rentals/rentals.service';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './scheduler/tasks.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TasksModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [Customer, Film, Rental],
      synchronize: true,
      extra: {
        timezone: 'Europe/Paris',
      },
    }),
    TypeOrmModule.forFeature([Customer, Film, Rental]),
  ],
  controllers: [
    AppController,
    CustomersController,
    FilmsController,
    RentalsController,
  ],
  providers: [AppService, CustomersService, FilmsService, RentalsService],
})
export class AppModule {}
