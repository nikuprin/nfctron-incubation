import { CreateCustomerDto } from './models/create-customer.dto';
import { Customer } from './models/customer.interface';
import { UpdateCustomerDto } from './models/update-customer.dto';

export const CUSTOMER_DATA_SERVICE_TOKEN = 'CUSTOMER_DATA_SERVICE';
export interface CustomerData {
  create(dto: CreateCustomerDto): Promise<Customer>;
  getById(id: string): Promise<Customer>;
  getAll(): Promise<Customer[]>;
  update(id: string, dto: UpdateCustomerDto): Promise<Customer>;
}
