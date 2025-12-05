import { faker } from '@faker-js/faker';
import { Inject, Injectable } from '@nestjs/common';
import type { CustomerData } from '../data/customer-data.interface';
import { CUSTOMER_DATA_SERVICE_TOKEN } from '../data/customer-data.interface';

@Injectable()
export class SeederService {
  constructor(
    @Inject(CUSTOMER_DATA_SERVICE_TOKEN)
    private readonly dataService: CustomerData,
  ) {}

  async seed() {
    const count = 10;
    for (let i = 0; i < count; i++) {
      const customer = {
        id: faker.string.uuid(),
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        createdAt: faker.date.past(),
      };
      await this.dataService.create(customer);
    }
  }
}
