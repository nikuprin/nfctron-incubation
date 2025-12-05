import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Customer } from './models/customer.interface';
import { CreateCustomerDto } from './models/create-customer.dto';
import { UpdateCustomerDto } from './models/update-customer.dto';
import { CustomerData } from './customer-data.interface';

@Injectable()
export class InMemoryDataService implements CustomerData {
  private readonly customers: Customer[] = [];

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

    const customer: Customer = {
      id: crypto.randomUUID(),
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      createdAt: new Date(),
    };
    this.customers.push(customer);
    return customer;
  }

  /**
   * Gets customer by id.
   * @param id User id.
   * @throws {NotFoundException} if user not found.
   */
  public async getById(id: string): Promise<Customer> {
    for (const customer of this.customers.values()) {
      if (customer.id === id) {
        return customer;
      }
    }

    throw new NotFoundException(`Custmoer with id ${id} not found.`);
  }

  /**
   * Gets all customers.
   */
  public async getAll(): Promise<Customer[]> {
    return this.customers;
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

    return customer;
  }

  /**
   * Checks if a given email address already exists among stored customers.
   * @param email The email address to check.
   */
  private async checkIfEmailExists(email: string): Promise<boolean> {
    console.log(this.customers);
    const normalizedEmail = email.toLowerCase().trim();
    for (const customer of this.customers.values()) {
      if (customer.email.toLowerCase().trim() === normalizedEmail) {
        return true;
      }
    }

    return false;
  }
}
