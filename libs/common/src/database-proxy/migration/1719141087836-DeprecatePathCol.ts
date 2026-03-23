import { MigrationInterface, QueryRunner } from "typeorm";

export class DeprecatePathCol1719141087836 implements MigrationInterface {
    name = 'DeprecatePathCol1719141087836'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "delivery" ADD "path" character varying`);
        await queryRunner.query(`ALTER TABLE "delivery" ADD "progress" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "delivery" DROP COLUMN "progress"`);
        await queryRunner.query(`ALTER TABLE "delivery" DROP COLUMN "path"`);
    }

}
