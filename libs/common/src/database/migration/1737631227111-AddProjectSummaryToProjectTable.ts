import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProjectSummaryToProjectTable1737631227111 implements MigrationInterface {
    name = 'AddProjectSummaryToProjectTable1737631227111'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" ADD "project_summary" jsonb DEFAULT '{}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "project_summary"`);
    }

}
