import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rental } from '../entities/Rental.entity';
import { CreateRentalDto } from './dto/create-rental.dto';
import { UpdateRentalDto } from './dto/update-rental.dto';

@Injectable()
export class RentalsService {
  constructor(
    @InjectRepository(Rental)
    private rentalsRepository: Repository<Rental>,
  ) {}

  findAll(): Promise<Rental[]> {
    return this.rentalsRepository.find();
  }

  async findOne(id: number): Promise<Rental> {
    const Rental = await this.rentalsRepository.findOne({
      where: { rental_id: id },
    });
    if (!Rental) {
      throw new NotFoundException(`Rental with ID ${id} not found`);
    }
    //la date est bonne ainsi que l'heure dans la bdd mais pour ce qui est de la recuperation
    //solution de contournement:
    // console.log(Rental.rental_date.toLocaleString());
    console.log(Rental.rental_date.toLocaleString());
    return Rental;
  }

  async create(CreateRentalDto: CreateRentalDto): Promise<Rental> {
    // const rental = this.rentalsRepository.create(CreateRentalDto);
    // voir la logigue dans le dto pour gerer le cas de la date etc
    // rental.rental_date = new Date();

    // const dateOfReturnMin = new Date(rental.rental_date);
    // dateOfReturnMin.setDate(dateOfReturnMin.getDate() + 7);

    // const dateOfReturnMax = new Date(rental.rental_date);
    // dateOfReturnMax.setDate(dateOfReturnMax.getDate() + 21);

    // // Vérification si l'utilisateur a donné une date de retour
    // if (rentalData.return_date) {
    //   const ReturnDate = new Date(rentalData.return_date);

    //   if (ReturnDate < dateOfReturnMin) {
    //     throw new BadRequestException(
    //       "La date de retour est au minimum d'une semaine après la date de location.",
    //     );
    //   }
    //   if (ReturnDate > dateOfReturnMax) {
    //     throw new BadRequestException(
    //       'La date de retour est au maximim de trois semaines après la date de location.',
    //     );
    //   }
    //   rental.return_date = ReturnDate;
    // } else {
    //   // Par default on fixe la date de retour a 1 semaine si aucune date de retour n'est fourni
    //   rental.return_date = dateOfReturnMin;
    // }
    return await this.rentalsRepository.save(CreateRentalDto);
  }

  async update(id: number, UpdateRentalDto: UpdateRentalDto): Promise<Rental> {
    const rental = await this.rentalsRepository.findOne({
      where: { rental_id: id },
    });
    if (!rental) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    } else {
      Object.assign(rental, UpdateRentalDto);
    }
    return this.rentalsRepository.save(rental);
  }

  async delete(id: number): Promise<void> {
    const result = await this.rentalsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Aucun rental with ID ${id} not found`);
    }
  }
}
