import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMapPathToConfig1721294872862 implements MigrationInterface {
    name = 'AddMapPathToConfig1721294872862'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "map_configs" ADD "ortophoto_map_path" character varying`);
        await queryRunner.query(`ALTER TABLE "map_configs" ADD "control_map_path" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "map_configs" DROP COLUMN "control_map_path"`);
        await queryRunner.query(`ALTER TABLE "map_configs" DROP COLUMN "ortophoto_map_path"`);
    }

}
