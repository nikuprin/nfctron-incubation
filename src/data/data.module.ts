import { Module } from '@nestjs/common';
import { CUSTOMER_DATA_SERVICE_TOKEN } from './customer-data.interface';
import { InMemoryDataService } from './in-memory-data.service';

const dataServiceProviders = {
  provide: CUSTOMER_DATA_SERVICE_TOKEN,
  useClass: InMemoryDataService,
};

@Module({
  providers: [dataServiceProviders, InMemoryDataService],
  exports: [CUSTOMER_DATA_SERVICE_TOKEN],
})
export class DataModule {}
