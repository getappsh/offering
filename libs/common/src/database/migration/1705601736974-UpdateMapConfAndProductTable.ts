import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateMapConfAndProductTable1705601736974 implements MigrationInterface {
    name = 'UpdateMapConfAndProductTable1705601736974'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "map_product" ADD "is_checked_against_maps" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "map_configs" ADD "matomo_periodic_mins" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "map_configs" DROP COLUMN "matomo_periodic_mins"`);
        await queryRunner.query(`ALTER TABLE "map_product" DROP COLUMN "is_checked_against_maps"`);
    }

}
