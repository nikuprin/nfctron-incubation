import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './../src/app.controller';
import { DataModule } from './../src/data/data.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) => {
            // Use in-memory SQLite for e2e tests
            return {
              type: 'better-sqlite3',
              database: ':memory:',
              autoLoadEntities: true,
              synchronize: true,
            };
          },
          inject: [ConfigService],
        }),
        DataModule,
      ],
      controllers: [AppController],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('Customers (POST /customers)', () => {
    it('creates a customer', async () => {
      const dto = {
        name: 'Alice Example',
        email: 'alice@example.com',
        phone: '+10000000000',
      };

      const response = await request(app.getHttpServer())
        .post('/customers')
        .send(dto)
        .expect(201);

      expect(response.body).toBeDefined();
      expect(response.body.id).toBeDefined();
      expect(response.body.name).toBe(dto.name);
      expect(response.body.email).toBe(dto.email);
      expect(response.body.phone).toBe(dto.phone);
      expect(response.body.createdAt).toBeDefined();
    });

    it('throws ConflictException when creating duplicate email (case-insensitive)', async () => {
      const email = 'dup@example.com';

      await request(app.getHttpServer())
        .post('/customers')
        .send({ name: 'First', email })
        .expect(201);

      const response = await request(app.getHttpServer())
        .post('/customers')
        .send({
          name: 'Second',
          email: 'DUP@example.com',
        })
        .expect(409);

      expect(response.body.statusCode).toBe(409);
    });
  });

  describe('Customers (GET /customers)', () => {
    it('returns all customers', async () => {
      // Create a couple of customers
      await request(app.getHttpServer())
        .post('/customers')
        .send({
          name: 'C1',
          email: 'c1@example.com',
        })
        .expect(201);

      await request(app.getHttpServer())
        .post('/customers')
        .send({
          name: 'C2',
          email: 'c2@example.com',
        })
        .expect(201);

      const response = await request(app.getHttpServer())
        .get('/customers')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Customers (GET /customers/:id)', () => {
    it('gets customer by id', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/customers')
        .send({ name: 'Bob', email: 'bob@example.com' })
        .expect(201);

      const customerId = createResponse.body.id;

      const response = await request(app.getHttpServer())
        .get(`/customers/${customerId}`)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.id).toBe(customerId);
      expect(response.body.email).toBe('bob@example.com');
    });

    it('throws NotFoundException when getById not found', async () => {
      const response = await request(app.getHttpServer())
        .get('/customers/non-existing-id')
        .expect(404);

      expect(response.body.statusCode).toBe(404);
    });
  });

  describe('Customers (PUT /customers/:id)', () => {
    it('updates a customer fields', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/customers')
        .send({
          name: 'ToUpdate',
          email: 'up@example.com',
        })
        .expect(201);

      const customerId = createResponse.body.id;

      const updateDto = {
        name: 'Updated',
        phone: '+19999999999',
      };

      const updateResponse = await request(app.getHttpServer())
        .put(`/customers/${customerId}`)
        .send(updateDto)
        .expect(200);

      expect(updateResponse.body.id).toBe(customerId);
      expect(updateResponse.body.name).toBe(updateDto.name);
      expect(updateResponse.body.phone).toBe(updateDto.phone);
    });

    it('throws NotFoundException when updating missing id', async () => {
      const response = await request(app.getHttpServer())
        .put('/customers/no-id')
        .send({ name: 'x' })
        .expect(404);

      expect(response.body.statusCode).toBe(404);
    });

    it('throws ConflictException when updating to an existing email (case-insensitive)', async () => {
      const first = await request(app.getHttpServer())
        .post('/customers')
        .send({
          name: 'A',
          email: 'a@example.com',
        })
        .expect(201);

      const second = await request(app.getHttpServer())
        .post('/customers')
        .send({
          name: 'B',
          email: 'b@example.com',
        })
        .expect(201);

      const response = await request(app.getHttpServer())
        .put(`/customers/${second.body.id}`)
        .send({
          email: 'A@EXAMPLE.com',
        })
        .expect(409);

      expect(response.body.statusCode).toBe(409);
    });
  });
});
