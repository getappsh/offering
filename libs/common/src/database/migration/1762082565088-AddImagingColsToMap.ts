import { MigrationInterface, QueryRunner } from "typeorm";

export class AddImagingColsToMap1762082565088 implements MigrationInterface {
    name = 'AddImagingColsToMap1762082565088'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "map" ADD "imaging_start" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "map" ADD "imaging_end" TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "map" DROP COLUMN "imaging_end"`);
        await queryRunner.query(`ALTER TABLE "map" DROP COLUMN "imaging_start"`);
    }

}
