import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { CUSTOMER_DATA_SERVICE_TOKEN } from './customer-data.interface';
import type { CustomerData } from './customer-data.interface';

@Injectable()
export class CustomerSeederService implements OnModuleInit {
  constructor(
    @Inject(CUSTOMER_DATA_SERVICE_TOKEN)
    private readonly customerService: CustomerData,
  ) {}

  async onModuleInit() {
    const count = 10;
    for (let i = 0; i < count; i++) {
      const customer = {
        id: faker.string.uuid(),
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        createdAt: faker.date.past(),
      };
      await this.customerService.create(customer);
    }
  }
}
