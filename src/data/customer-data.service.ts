import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Customer } from './models/customer.interface';
import { CreateCustomerDto } from './models/create-customer.dto';
import { UpdateCustomerDto } from './models/update-customer.dto';
import { CustomerData } from './customer-data.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerEntity } from './models/customer.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CustomerDataService implements CustomerData {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly customers: Repository<CustomerEntity>,
  ) {}

  /**
   * Creates new customer record.
   * @param dto Customer data.
   * @throws {ConflictException} if the email already exists.
   */
  public async create(dto: CreateCustomerDto): Promise<Customer> {
    if (await this.checkIfEmailExists(dto.email)) {
      throw new ConflictException(
        `Customer with email ${dto.email} already exists.`,
      );
    }

    const customer = new CustomerEntity();
    customer.name = dto.name;
    customer.email = dto.email.toLocaleLowerCase().trim();
    customer.phone = dto.phone;
    customer.createdAt = new Date();
    await this.customers.save(customer);
    return customer;
  }

  /**
   * Gets customer by id.
   * @param id User id.
   * @throws {NotFoundException} if user not found.
   */
  public async getById(id: string): Promise<Customer> {
    const customer = await this.customers.findOneBy({ id });
    if (!customer) {
      throw new NotFoundException(`Customer with id ${id} not found.`);
    }
    return customer;
  }

  /**
   * Gets all customers.
   */
  public async getAll(): Promise<Customer[]> {
    return await this.customers.find();
  }

  public async update(id: string, dto: UpdateCustomerDto): Promise<Customer> {
    const customer = await this.getById(id);

    // there should be no duplicate emails
    if (
      dto.email &&
      dto.email != customer.email &&
      (await this.checkIfEmailExists(dto.email))
    ) {
      throw new ConflictException(
        `Customer with new email ${dto.email} already exists.`,
      );
    }

    if (dto.name) {
      customer.name = dto.name;
    }

    if (dto.email) {
      customer.email = dto.email;
    }

    if (dto.phone) {
      customer.phone = dto.phone;
    }

    customer.updatedAt = new Date();
    await this.customers.save(customer);
    return customer;
  }

  /**
   * Checks if a given email address already exists among stored customers.
   * @param email The email address to check.
   */
  private async checkIfEmailExists(email: string): Promise<boolean> {
    const normalizedEmail = email.toLowerCase().trim();
    const existing = await this.customers.findOneBy({ email: normalizedEmail });
    return !!existing;
  }
}
