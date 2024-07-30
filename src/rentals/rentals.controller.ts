import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { RentalsService } from './rentals.service';
import { Rental } from 'src/entities/Rental.entity';

@Controller('rentals')
export class RentalsController {
  constructor(private readonly rentalsService: RentalsService) {}

  @Get()
  findAll() {
    return this.rentalsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Rental> {
    return this.rentalsService.findOne(id);
  }

  @Post()
  create(@Body() rentaldata: Rental): Promise<Rental> {
    return this.rentalsService.create(rentaldata);
  }

  // Ajoutez d'autres routes CRUD ici
}
