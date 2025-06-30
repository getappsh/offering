import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDownloadAndDeployDateToDeviceMapAndComponentTables1740651184731 implements MigrationInterface {
    name = 'AddDownloadAndDeployDateToDeviceMapAndComponentTables1740651184731'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "device_map" ADD "downloaded_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "device_map" ADD "deployed_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "device_map" ADD "error" character varying`);
        await queryRunner.query(`ALTER TABLE "device_component" ADD "downloaded_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "device_component" ADD "deployed_at" TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "device_component" DROP COLUMN "deployed_at"`);
        await queryRunner.query(`ALTER TABLE "device_component" DROP COLUMN "downloaded_at"`);
        await queryRunner.query(`ALTER TABLE "device_map" DROP COLUMN "error"`);
        await queryRunner.query(`ALTER TABLE "device_map" DROP COLUMN "deployed_at"`);
        await queryRunner.query(`ALTER TABLE "device_map" DROP COLUMN "downloaded_at"`);
    }

}
