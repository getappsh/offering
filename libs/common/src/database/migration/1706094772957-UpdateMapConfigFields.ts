import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateMapConfigFields1706094772957 implements MigrationInterface {
    name = 'UpdateMapConfigFields1706094772957'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "map_configs" RENAME COLUMN "max_map_size_meter" TO "max_map_area_sq_km"`);
        await queryRunner.query(`ALTER TABLE "map_configs" RENAME COLUMN "min_space_byte" TO "min_space_mb"`);
        await queryRunner.query(`ALTER TABLE "version_packages" ALTER COLUMN "lastUpdatedDate" TYPE TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "member" ALTER COLUMN "lastUpdatedDate" TYPE TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "member_project" ALTER COLUMN "lastUpdatedDate" TYPE TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "project" ALTER COLUMN "lastUpdatedDate" TYPE TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "devices_group" ALTER COLUMN "lastUpdatedDate" TYPE TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "device_map" ALTER COLUMN "lastUpdatedDate" TYPE TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "discovery_message" ALTER COLUMN "lastUpdatedDate" TYPE TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "delivery_status" ALTER COLUMN "lastUpdatedDate" TYPE TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "deploy_status" ALTER COLUMN "lastUpdatedDate" TYPE TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "map_configs" ALTER COLUMN "lastUpdatedDate" TYPE TIMESTAMP WITH TIME ZONE`);
    }
    
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "map_configs" ALTER COLUMN "lastUpdatedDate" TYPE TIMESTAMP WITHOUT TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "deploy_status" ALTER COLUMN "lastUpdatedDate" TYPE TIMESTAMP WITHOUT TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "delivery_status" ALTER COLUMN "lastUpdatedDate" TYPE TIMESTAMP WITHOUT TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "discovery_message" ALTER COLUMN "lastUpdatedDate" TYPE TIMESTAMP WITHOUT TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "device_map" ALTER COLUMN "lastUpdatedDate" TYPE TIMESTAMP WITHOUT TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "devices_group" ALTER COLUMN "lastUpdatedDate" TYPE TIMESTAMP WITHOUT TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "project" ALTER COLUMN "lastUpdatedDate" TYPE TIMESTAMP WITHOUT TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "member_project" ALTER COLUMN "lastUpdatedDate" TYPE TIMESTAMP WITHOUT TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "member" ALTER COLUMN "lastUpdatedDate" TYPE TIMESTAMP WITHOUT TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "version_packages" ALTER COLUMN "lastUpdatedDate" TYPE TIMESTAMP WITHOUT TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "map_configs" RENAME COLUMN "min_space_mb" TO "min_space_byte"`);
        await queryRunner.query(`ALTER TABLE "map_configs" RENAME COLUMN "max_map_area_sq_km" TO "max_map_size_meter"`);
    }
}
