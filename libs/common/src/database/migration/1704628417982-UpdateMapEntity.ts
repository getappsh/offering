import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateMapEntity1704628417982 implements MigrationInterface {
    name = 'UpdateMapEntity1704628417982'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "map" ADD "size" integer`);
        await queryRunner.query(`ALTER TABLE "map" ADD "error_reason" character varying`);
        await queryRunner.query(`ALTER TABLE "map_product" DROP COLUMN "max_resolution_deg"`);
        await queryRunner.query(`ALTER TABLE "map_product" ADD "max_resolution_deg" double precision`);
        await queryRunner.query(`ALTER TABLE "map" DROP COLUMN "job_id"`);
        await queryRunner.query(`ALTER TABLE "map" ADD "job_id" bigint`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "map" DROP COLUMN "job_id"`);
        await queryRunner.query(`ALTER TABLE "map" ADD "job_id" character varying`);
        await queryRunner.query(`ALTER TABLE "map_product" DROP COLUMN "max_resolution_deg"`);
        await queryRunner.query(`ALTER TABLE "map_product" ADD "max_resolution_deg" integer`);
        await queryRunner.query(`ALTER TABLE "map" DROP COLUMN "error_reason"`);
        await queryRunner.query(`ALTER TABLE "map" DROP COLUMN "size"`);
    }

}
