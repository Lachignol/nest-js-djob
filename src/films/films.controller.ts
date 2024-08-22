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
import { FilmsService } from './films.service';
import { Film } from 'src/entities/Film.entity';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  findAll() {
    return this.filmsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Film> {
    return this.filmsService.findOne(id);
  }

  @Post()
  async create(@Body(ValidationPipe) CreateFilmDto: CreateFilmDto) {
    return await this.filmsService.create(CreateFilmDto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) UpdateFilmDto: UpdateFilmDto,
  ): Promise<Film> {
    return this.filmsService.update(id, UpdateFilmDto);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.filmsService.delete(id);
  }
}
