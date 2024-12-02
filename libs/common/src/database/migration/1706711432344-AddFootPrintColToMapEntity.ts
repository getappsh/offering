import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFootPrintColToMapEntity1706711432344 implements MigrationInterface {
    name = 'AddFootPrintColToMapEntity1706711432344'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "map" ADD "foot_print" character varying`);
        await queryRunner.query(`UPDATE "map" SET "foot_print" = "bounding_box" WHERE status = 'Done'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "map" DROP COLUMN "foot_print"`);
    }

}
