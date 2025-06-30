import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTargetStoragePolicy1714554696972 implements MigrationInterface {
    name = 'AddTargetStoragePolicy1714554696972'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "map_configs" DROP COLUMN "use_SD_card"`);
        await queryRunner.query(`ALTER TABLE "map_configs" DROP COLUMN "relative_storage_path"`);
        await queryRunner.query(`ALTER TABLE "map_configs" ADD "sd_storage_path" character varying`);
        await queryRunner.query(`ALTER TABLE "map_configs" ADD "flash_storage_path" character varying`);
        await queryRunner.query(`CREATE TYPE "public"."map_configs_target_storage_policy_enum" AS ENUM('SDOnly', 'FlashThenSD', 'SDThenFlash', 'FlashOnly')`);
        await queryRunner.query(`ALTER TABLE "map_configs" ADD "target_storage_policy" "public"."map_configs_target_storage_policy_enum" NOT NULL DEFAULT 'SDOnly'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "map_configs" DROP COLUMN "target_storage_policy"`);
        await queryRunner.query(`DROP TYPE "public"."map_configs_target_storage_policy_enum"`);
        await queryRunner.query(`ALTER TABLE "map_configs" DROP COLUMN "flash_storage_path"`);
        await queryRunner.query(`ALTER TABLE "map_configs" DROP COLUMN "sd_storage_path"`);
        await queryRunner.query(`ALTER TABLE "map_configs" ADD "relative_storage_path" character varying`);
        await queryRunner.query(`ALTER TABLE "map_configs" ADD "use_SD_card" boolean`);
    }

}
