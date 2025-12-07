import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerDataService } from './customer-data.service';
import { CreateCustomerDto } from './models/create-customer.dto';
import { CustomerEntity } from './models/customer.entity';
import { UpdateCustomerDto } from './models/update-customer.dto';

describe('CustomerDataService', () => {
  let service: CustomerDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'better-sqlite3',
          database: ':memory:',
          autoLoadEntities: true,
          synchronize: true,
        }),
        TypeOrmModule.forFeature([CustomerEntity]),
      ],
      providers: [CustomerDataService],
    }).compile();

    service = module.get<CustomerDataService>(CustomerDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('creates a customer', async () => {
    const dto: CreateCustomerDto = {
      name: 'Alice Example',
      email: 'alice@example.com',
      phone: '+10000000000',
    };

    const created = await service.create(dto);

    expect(created).toBeDefined();
    expect(created.id).toBeDefined();
    expect(created.name).toBe(dto.name);
    expect(created.email).toBe(dto.email);
    expect(created.phone).toBe(dto.phone);
    expect(created.createdAt).toBeInstanceOf(Date);
  });

  it('returns all customers', async () => {
    // ensure fresh state by creating a couple
    await service.create({
      name: 'C1',
      email: 'c1@example.com',
    } as CreateCustomerDto);
    await service.create({
      name: 'C2',
      email: 'c2@example.com',
    } as CreateCustomerDto);

    const all = await service.getAll();
    expect(Array.isArray(all)).toBe(true);
    expect(all.length).toBeGreaterThanOrEqual(2);
  });

  it('gets customer by id', async () => {
    const dto: CreateCustomerDto = { name: 'Bob', email: 'bob@example.com' };
    const created = await service.create(dto);

    const found = await service.getById(created.id);
    expect(found).toBeDefined();
    expect(found.id).toBe(created.id);
    expect(found.email).toBe(created.email);
  });

  it('throws NotFoundException when getById not found', async () => {
    await expect(service.getById('non-existing-id')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('throws ConflictException when creating duplicate email (case-insensitive)', async () => {
    const email = 'dup@example.com';
    await service.create({ name: 'First', email } as CreateCustomerDto);

    await expect(
      service.create({
        name: 'Second',
        email: 'DUP@example.com',
      } as CreateCustomerDto),
    ).rejects.toThrow(ConflictException);
  });

  it('updates a customer fields', async () => {
    const created = await service.create({
      name: 'ToUpdate',
      email: 'up@example.com',
    } as CreateCustomerDto);

    const dto: UpdateCustomerDto = {
      name: 'Updated',
      phone: '+19999999999',
    } as UpdateCustomerDto;
    const updated = await service.update(created.id, dto);

    expect(updated.id).toBe(created.id);
    expect(updated.name).toBe(dto.name);
    expect(updated.phone).toBe(dto.phone);
  });

  it('throws NotFoundException when updating missing id', async () => {
    await expect(
      service.update('no-id', { name: 'x' } as UpdateCustomerDto),
    ).rejects.toThrow(NotFoundException);
  });

  it('throws ConflictException when updating to an existing email (case-insensitive)', async () => {
    const first = await service.create({
      name: 'A',
      email: 'a@example.com',
    } as CreateCustomerDto);
    const second = await service.create({
      name: 'B',
      email: 'b@example.com',
    } as CreateCustomerDto);

    await expect(
      service.update(second.id, {
        email: 'A@EXAMPLE.com',
      } as UpdateCustomerDto),
    ).rejects.toThrow(ConflictException);
  });
});
