# NFCtron Backend Case Study - Showcase Implementation

This is a showcase implementation of the [NFCtron Backend Case Study](https://github.com/NFCtron/backend-case-study) for the Backend Developer | Incubation 2025 position.

## Overview

A NestJS-based customer management API that demonstrates core backend development concepts.

## Features

- **RESTful Customer API** - CRUD operations for customer records
  - List all customers
  - Get customer details by ID
  - Create new customer
  - Update existing customer

- **Architecture** - Well-structured NestJS application with separation of concerns
  - AppModule and AppController for HTTP handling
  - DataModule with service layer abstraction
  - In-memory data store with TypeScript interfaces

- **Testing** - Unit test coverage for Data module basic operations
- **API Documentation** - Interactive Swagger/OpenAPI documentation
- **Deployment** - Live deployment on Fly.io

## Technology Stack

- **Runtime**: Node.js 20+
- **Framework**: NestJS 10
- **Language**: TypeScript
- **Package Manager**: pnpm
- **Testing**: Jest
- **Version Control**: Git with Conventional Commits

## Installation

```bash
pnpm install
```

## Running the Application

```bash
# Development mode
pnpm run start

# Watch mode (hot-reload)
pnpm run start:dev

# Production mode
pnpm run start:prod
```

The application runs on port 3000 by default (configurable via `PORT` environment variable).

## Testing

```bash
# Unit tests
pnpm run test

# E2E tests
pnpm run test:e2e

# Coverage report
pnpm run test:cov
```

## API Documentation

Interactive Swagger documentation is available at:

- **Live**: [https://nfctron-incubation.fly.dev/swagger](https://nfctron-incubation.fly.dev/swagger)
- **Local**: `http://localhost:3000/swagger` (when running locally)

## Deployment

The application is deployed and accessible at: [https://nfctron-incubation.fly.dev](https://nfctron-incubation.fly.dev)

## Project Structure

```
src/
├── app.controller.ts               # HTTP endpoints
├── app.module.ts                   # Root module
├── main.ts                         # Entry point
└── data/
    ├── data.module.ts              # Data module
    ├── customer-data.interface.ts  # Data service interface
    ├── in-memory-data.service.ts   # In-memory implementation
    └── models/
        ├── customer.interface.ts
        ├── customer.dto.ts
        ├── create-customer.dto.ts
        └── update-customer.dto.ts
```

## Implementation Details

- ✅ 4 RESTful endpoints (list, get, create, update)
- ✅ Type-safe DTOs and interfaces
- ✅ Service layer pattern for data management
- ✅ Unit tests
- ✅ Conventional commit format
- ✅ Random data seeding with Faker
- ✅ Swagger/OpenAPI documentation
- ✅ Production deployment
