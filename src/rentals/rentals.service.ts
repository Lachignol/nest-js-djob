import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rental } from '../entities/Rental.entity';

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

  async create(rentalData: Partial<Rental>): Promise<Rental> {
    const rental = this.rentalsRepository.create(rentalData);
    rental.rental_date = new Date();

    const dateOfReturnMin = new Date(rental.rental_date);
    dateOfReturnMin.setDate(dateOfReturnMin.getDate() + 7);

    const dateOfReturnMax = new Date(rental.rental_date);
    dateOfReturnMax.setDate(dateOfReturnMax.getDate() + 21);

    // Vérification si l'utilisateur a donné une date de retour
    if (rentalData.return_date) {
      const ReturnDate = new Date(rentalData.return_date);

      if (ReturnDate < dateOfReturnMin) {
        throw new BadRequestException(
          "La date de retour est au minimum d'une semaine après la date de location.",
        );
      }
      if (ReturnDate > dateOfReturnMax) {
        throw new BadRequestException(
          'La date de retour est au maximim de trois semaines après la date de location.',
        );
      }
      rental.return_date = ReturnDate;
    } else {
      // Par default on fixe la date de retour a 1 semaine si aucune date de retour n'est fourni
      rental.return_date = dateOfReturnMin;
    }
    return await this.rentalsRepository.save(rental);
    // Ajoutez d'autres méthodes CRUD ici
  }
}
