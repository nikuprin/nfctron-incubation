import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CUSTOMER_DATA_SERVICE_TOKEN } from './customer-data.interface';
import { CustomerDataService } from './customer-data.service';
import { CustomerEntity } from './models/customer.entity';

const dataServiceProviders = {
  provide: CUSTOMER_DATA_SERVICE_TOKEN,
  useClass: CustomerDataService,
};

@Module({
  imports: [TypeOrmModule.forFeature([CustomerEntity])],
  providers: [dataServiceProviders, CustomerDataService],
  exports: [CUSTOMER_DATA_SERVICE_TOKEN],
})
export class DataModule {}
