import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { Repository } from 'typeorm';
import { Film } from '../entities/Film.entity';

@Injectable()
export class FilmsService {
  constructor(
    @InjectRepository(Film)
    private filmsRepository: Repository<Film>,
  ) {}

  findAll(): Promise<Film[]> {
    return this.filmsRepository.find();
  }

  async findOne(id: number): Promise<Film> {
    const film = await this.filmsRepository.findOne({
      where: { film_id: id },
    });
    if (!film) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    return film;
  }

  async create(CreateFilmDto: CreateFilmDto): Promise<Film> {
    return await this.filmsRepository.save(CreateFilmDto);
  }

  async update(id: number, UpdateFilmDto: UpdateFilmDto): Promise<Film> {
    const film = await this.filmsRepository.findOne({
      where: { film_id: id },
    });
    if (!film) {
      throw new NotFoundException(`film with ID ${id} not found`);
    } else {
      Object.assign(film, UpdateFilmDto);
    }
    return this.filmsRepository.save(film);
  }

  async delete(id: number): Promise<void> {
    const result = await this.filmsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Film with ID ${id} not found`);
    }
  }
}
