import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import { RentalsService } from './rentals.service';
import { Rental } from 'src/entities/Rental.entity';
import { CreateRentalDto } from './dto/create-rental.dto';
import { UpdateRentalDto } from './dto/update-rental.dto';

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
  create(
    @Body(ValidationPipe) CreateRentalDto: CreateRentalDto,
  ): Promise<Rental> {
    return this.rentalsService.create(CreateRentalDto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) UpdateRentalDto: UpdateRentalDto,
  ): Promise<Rental> {
    return this.rentalsService.update(id, UpdateRentalDto);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.rentalsService.delete(id);
  }
}
