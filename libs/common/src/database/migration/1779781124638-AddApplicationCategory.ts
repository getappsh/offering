import { MigrationInterface, QueryRunner } from "typeorm";

export class AddApplicationCategory1779781124638 implements MigrationInterface {
    name = 'AddApplicationCategory1779781124638'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."labels_application_category_enum" AS ENUM('user', 'technician')`);
        await queryRunner.query(`ALTER TABLE "labels" ADD "application_category" "public"."labels_application_category_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."project_application_category_enum" AS ENUM('user', 'technician')`);
        await queryRunner.query(`ALTER TABLE "project" ADD "application_category" "public"."project_application_category_enum"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "application_category"`);
        await queryRunner.query(`DROP TYPE "public"."project_application_category_enum"`);
        await queryRunner.query(`ALTER TABLE "labels" DROP COLUMN "application_category"`);
        await queryRunner.query(`DROP TYPE "public"."labels_application_category_enum"`);
    }

}
