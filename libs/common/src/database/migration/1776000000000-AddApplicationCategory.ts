import { MigrationInterface, QueryRunner } from "typeorm";

export class AddApplicationCategory1776000000000 implements MigrationInterface {
    name = 'AddApplicationCategory1776000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "application_category_enum" AS ENUM ('user', 'technician')
        `);

        await queryRunner.query(`
            ALTER TABLE "project"
            ADD COLUMN IF NOT EXISTS "application_category" "application_category_enum" NULL
        `);

        await queryRunner.query(`
            UPDATE "project"
            SET "application_category" = 'user'
            WHERE "project_type" = 'application'
        `);

        await queryRunner.query(`
            ALTER TABLE "labels"
            ADD COLUMN IF NOT EXISTS "application_category" "application_category_enum" NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "labels"
            DROP COLUMN IF EXISTS "application_category"
        `);

        await queryRunner.query(`
            ALTER TABLE "project"
            DROP COLUMN IF EXISTS "application_category"
        `);

        await queryRunner.query(`
            DROP TYPE IF EXISTS "application_category_enum"
        `);
    }
}
