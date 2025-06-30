import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMapInventoryMaxSize1716723994336 implements MigrationInterface {
    name = 'AddMapInventoryMaxSize1716723994336'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "map_configs" ADD "sd_inventory_max_size_mb" integer`);
        await queryRunner.query(`ALTER TABLE "map_configs" ADD "flash_inventory_max_size_mb" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "map_configs" DROP COLUMN "flash_inventory_max_size_mb"`);
        await queryRunner.query(`ALTER TABLE "map_configs" DROP COLUMN "sd_inventory_max_size_mb"`);
    }

}
