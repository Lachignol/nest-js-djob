import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../entities/Customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customersRepository: Repository<Customer>,
  ) {}

  findAll(): Promise<Customer[]> {
    return this.customersRepository.find();
  }

  async findOne(id: number): Promise<Customer> {
    const customer = await this.customersRepository.findOne({
      where: { customer_id: id },
    });
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    return customer;
  }

  async create(CreateCustomerDto: CreateCustomerDto): Promise<Customer> {
    return await this.customersRepository.save(CreateCustomerDto);
  }

  async update(
    id: number,
    UpdateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    const customer = await this.customersRepository.findOne({
      where: { customer_id: id },
    });
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    } else {
      Object.assign(customer, UpdateCustomerDto);
    }
    return this.customersRepository.save(customer);
  }

  async delete(id: number): Promise<void> {
    const result = await this.customersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
  }

  // Ajoutez d'autres méthodes CRUD ici
}
