import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCreateDateWithTimeZone1708612152281 implements MigrationInterface {
    name = 'UpdateCreateDateWithTimeZone1708612152281'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "version_packages" ALTER COLUMN "createdDate" TYPE TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "member" ALTER COLUMN "createdDate" TYPE TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "member_project" ALTER COLUMN "createdDate" TYPE TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "project" ALTER COLUMN "createdDate" TYPE TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "devices_group" ALTER COLUMN "createdDate" TYPE TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "device_map" ALTER COLUMN "createdDate" TYPE TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "discovery_message" ALTER COLUMN "createdDate" TYPE TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "delivery_status" ALTER COLUMN "createdDate" TYPE TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "deploy_status" ALTER COLUMN "createdDate" TYPE TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "map_configs" ALTER COLUMN "createdDate" TYPE TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "map_configs" ALTER COLUMN "createdDate" TYPE TIMESTAMP WITHOUT TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "deploy_status" ALTER COLUMN "createdDate" TYPE TIMESTAMP WITHOUT TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "delivery_status" ALTER COLUMN "createdDate" TYPE TIMESTAMP WITHOUT TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "discovery_message" ALTER COLUMN "createdDate" TYPE TIMESTAMP WITHOUT TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "device_map" ALTER COLUMN "createdDate" TYPE TIMESTAMP WITHOUT TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "devices_group" ALTER COLUMN "createdDate" TYPE TIMESTAMP WITHOUT TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "project" ALTER COLUMN "createdDate" TYPE TIMESTAMP WITHOUT TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "member_project" ALTER COLUMN "createdDate" TYPE TIMESTAMP WITHOUT TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "member" ALTER COLUMN "createdDate" TYPE TIMESTAMP WITHOUT TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "version_packages" ALTER COLUMN "createdDate" TYPE TIMESTAMP WITHOUT TIME ZONE`);
    
    }

}
