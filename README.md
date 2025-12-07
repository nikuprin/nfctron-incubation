# NFCtron Backend — Updated Overview

This repository is a NestJS-based customer management API demonstrating a realistic backend stack:

- Production database: TypeORM + PostgreSQL (deployed on Neon)
- Unit tests: TypeORM + in-memory SQLite (`better-sqlite3`)
- Seeder: `@faker-js/faker` based seeder (`src/seeder.ts`)

## **Overview**

The service provides a small RESTful API for customer CRUD operations implemented with NestJS + TypeORM. The codebase includes migrations, a seeder, unit and e2e tests, and basic Swagger documentation.

**Key behaviours:**

- Create / Read / Update customers
- Type-safe DTOs and Entity mappings
- Seed data generation via Faker
- Tests run against an in-memory SQLite database for speed and isolation

## **Technology Stack**

- **Runtime:** Node.js 20+
- **Framework:** NestJS
- **ORM:** TypeORM 0.3.x
- **Databases:** PostgreSQL (production), SQLite (`better-sqlite3`) for tests
- **Seeder:** `@faker-js/faker`
- **Package manager:** `pnpm`
- **Test runner:** `jest`

## **Quickstart**

Install dependencies:

```bash
pnpm install
```

Run locally (connects to PostgreSQL if `DB_URL` is set, otherwise you can run with a local Postgres):

```bash
# Development mode (hot reload)
pnpm run start:dev

# Production build + run
pnpm run build
pnpm run start:prod
```

By default the app listens on port `3000`. You can change that via `PORT` environment variable.

## **Environment / Database (Postgres / Neon)**

This project expects a Postgres connection string in `DB_URL` (used by `src/data/orm.config.ts`). For Neon (managed Postgres) you will receive a connection string similar to:

```
postgresql://<user>:<pass>@<host>:<port>/<db>?sslmode=require
```

Set it in your environment (example `.env`):

```
DB_URL="postgresql://user:pass@your-neon-host:5432/dbname?sslmode=require"
PORT=3000
```

Notes:

- `orm.config.ts` reads `process.env.DB_URL` and sets `ssl: true` for secure Neon connections.
- Migrations in `src/data/migrations` can be applied using the TypeORM CLI or your preferred migration runner. Example (using the TypeORM CLI installed locally):

```bash
# run migrations (example; adjust for your setup)
pnpm exec typeorm-ts-node-commonjs migration:run --dataSource src/data/orm.config.ts
```

## **Testing (SQLite in-memory)**

Unit tests run against an in-memory SQLite database using the `better-sqlite3` driver. This is fast and requires no external DB when running `pnpm run test`.

```bash
# Run unit tests
pnpm run test

# Run e2e tests
pnpm run test:e2e
```

The test suites configure TypeORM with `type: 'better-sqlite3'` and `database: ':memory:'` (see `src/data/customer-data.service.spec.ts`).

## **Seeding (Faker.js)**

The seeder uses `@faker-js/faker` and the DI-bound data service to populate the database. The entrypoint is `src/seeder.ts` and there is a convenience script in `package.json`:

```bash
# Run the seeder (will use the DB configured by `DB_URL`)
pnpm run seed
```

Seeder notes:

- The seeder uses the same application modules so it writes via the application's `CustomerData` implementation (TypeORM repository).
- Ensure `DB_URL` is set to your target database before running the seeder.

## **Migrations**

Migrations live in `src/data/migrations`. To create or run migrations, use the TypeORM CLI or a script that loads `ts-node` and your TypeORM configuration. Example commands:

```bash
# create migration (example)
pnpm exec typeorm-ts-node-commonjs migration:create src/data/migrations/<name> --dataSource src/data/orm.config.ts

# run migrations
pnpm exec typeorm-ts-node-commonjs migration:run --dataSource src/data/orm.config.ts
```

## **Seeder / Test / CI Tips**

- For local development you can run a temporary Postgres instance (Docker) or use Neon and point `DB_URL` to it.
- CI pipelines should set a `DB_URL` for integration runs. Unit tests do not require network access thanks to in-memory SQLite.
- If you see SSL-related connection errors with Neon, confirm your `DB_URL` includes `sslmode=require` and that `orm.config.ts` uses `ssl: true`.

## **Project Structure (short)**

```
src/
├── app.module.ts
├── main.ts
├── seeder.ts            # CLI seeder using Faker
└── data/
    ├── orm.config.ts   # TypeORM DataSource configuration (uses DB_URL)
    ├── customer-data.service.ts
    ├── models/
    │   └── customer.entity.ts
    └── migrations/
```

## **Commands**

- **Install:** `pnpm install`
- **Dev:** `pnpm run start:dev`
- **Build:** `pnpm run build`
- **Run seeder:** `pnpm run seed`
- **Unit tests:** `pnpm run test`
- **E2E tests:** `pnpm run test:e2e`
