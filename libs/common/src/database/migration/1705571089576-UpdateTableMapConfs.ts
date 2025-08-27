import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTableMapConfs1705571089576 implements MigrationInterface {
    name = 'UpdateTableMapConfs1705571089576'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "map_configs" ADD "max_map_size_MB" integer`);
        await queryRunner.query(`ALTER TABLE "map_configs" ADD "matomo_url" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "map_configs" DROP COLUMN "matomo_url"`);
        await queryRunner.query(`ALTER TABLE "map_configs" DROP COLUMN "max_map_size_MB"`);
    }

}
