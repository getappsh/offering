import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFieldsToMapConfig1705915984411 implements MigrationInterface {
    name = 'AddFieldsToMapConfig1705915984411'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "map_configs" RENAME COLUMN "delivery_timeout" TO "delivery_timeout_mins"`);
        await queryRunner.query(`ALTER TABLE "map_configs" RENAME COLUMN "download_retry" TO "download_retry_time"`);
        await queryRunner.query(`ALTER TABLE "map_configs" RENAME COLUMN "download_timeout" TO "download_timeout_mins"`);
        await queryRunner.query(`ALTER TABLE "map_configs" ADD "map_min_inclusion_in_percentages" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "map_configs" DROP COLUMN "map_min_inclusion_in_percentages"`);
        await queryRunner.query(`ALTER TABLE "map_configs" RENAME COLUMN "delivery_timeout_mins" TO "delivery_timeout"`);
        await queryRunner.query(`ALTER TABLE "map_configs" RENAME COLUMN "download_retry_time" TO "download_retry"`);
        await queryRunner.query(`ALTER TABLE "map_configs" RENAME COLUMN "download_timeout_mins" TO "download_timeout"`);
    }

}
