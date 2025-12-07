import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1765110679380 implements MigrationInterface {
    name = 'Init1765110679380'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "customers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "phone" character varying, "createdAt" TIMESTAMP NOT NULL, "updatedAt" TIMESTAMP, CONSTRAINT "UQ_8536b8b85c06969f84f0c098b03" UNIQUE ("email"), CONSTRAINT "PK_133ec679a801fab5e070f73d3ea" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "customers"`);
    }

}
