import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStoragePath1713343979536 implements MigrationInterface {
    name = 'AddStoragePath1713343979536'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "map_configs" ADD "relative_storage_path" character varying`);
        await queryRunner.query(`ALTER TABLE "map_configs" ADD "use_SD_card" boolean`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "map_configs" DROP COLUMN "use_SD_card"`);
        await queryRunner.query(`ALTER TABLE "map_configs" DROP COLUMN "relative_storage_path"`);
    }

}
