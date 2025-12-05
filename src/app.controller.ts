import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateCustomerDto } from './data/models/create-customer.dto';
import { UpdateCustomerDto } from './data/models/update-customer.dto';
import {
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CustomerDto } from './data/models/customer.dto';
import { CUSTOMER_DATA_SERVICE_TOKEN } from './data/customer-data.interface';
import type { CustomerData } from './data/customer-data.interface';

@ApiTags('customers')
@Controller('customers')
export class AppController {
  constructor(
    @Inject(CUSTOMER_DATA_SERVICE_TOKEN)
    private readonly dataService: CustomerData,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create customer' })
  @ApiConflictResponse({ description: 'Uniqueness constraint failed' })
  async create(
    @Body() createCustomerDto: CreateCustomerDto,
  ): Promise<CustomerDto> {
    return await this.dataService.create(createCustomerDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get customer by ID' })
  @ApiNotFoundResponse({
    description: 'Customer with provided ID does not exist',
  })
  async getById(@Param() params: { id: string }): Promise<CustomerDto> {
    return await this.dataService.getById(params.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all customers' })
  async getAll(): Promise<CustomerDto[]> {
    return await this.dataService.getAll();
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update customer' })
  @ApiConflictResponse({ description: 'Uniqueness constraint failed' })
  @ApiNotFoundResponse({
    description: 'Customer with provided ID does not exist',
  })
  async update(
    @Param() params: any,
    @Body() dto: UpdateCustomerDto,
  ): Promise<CustomerDto> {
    return await this.dataService.update(params.id, dto);
  }
}
