import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProjectNameColToProject1756287421805 implements MigrationInterface {
    name = 'AddProjectNameColToProject1756287421805'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" ADD "project_name" character varying`);
        await queryRunner.query(`ALTER TABLE "project" ALTER COLUMN "description" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`UPDATE "project" SET "description" = '' WHERE "description" IS NULL`);
        await queryRunner.query(`ALTER TABLE "project" ALTER COLUMN "description" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "project_name"`);
    }

}
