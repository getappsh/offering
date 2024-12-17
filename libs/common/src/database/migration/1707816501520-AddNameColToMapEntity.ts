import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNameColToMapEntity1707816501520 implements MigrationInterface {
    name = 'AddNameColToMapEntity1707816501520'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "map" ADD "name" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "map" DROP COLUMN "name"`);
    }

}
