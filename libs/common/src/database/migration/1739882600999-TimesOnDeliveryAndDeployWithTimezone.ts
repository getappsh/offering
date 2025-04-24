import { MigrationInterface, QueryRunner } from "typeorm";

export class TimesOnDeliveryAndDeployWithTimezone1739882600999 implements MigrationInterface {
    name = 'TimesOnDeliveryAndDeployWithTimezone1739882600999'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "delivery_status" RENAME COLUMN "download_data" TO "progress"`);
        await queryRunner.query(`ALTER TABLE "delivery_status" ALTER COLUMN "progress" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "delivery_status" ALTER COLUMN "download_start" TYPE TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "delivery_status" ALTER COLUMN "download_stop" TYPE TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "delivery_status" ALTER COLUMN "download_done" TYPE TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "delivery_status" ALTER COLUMN "current_time" TYPE TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "deploy_status" ALTER COLUMN "deploy_start" TYPE TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "deploy_status" ALTER COLUMN "deploy_stop" TYPE TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "deploy_status" ALTER COLUMN "deploy_done" TYPE TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "deploy_status" ALTER COLUMN "current_time" TYPE TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "delivery_status" RENAME COLUMN "progress" TO "download_data"`);
        await queryRunner.query(`ALTER TABLE "delivery_status" ALTER COLUMN "download_data" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "delivery_status" ALTER COLUMN "download_start" TYPE TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "delivery_status" ALTER COLUMN "download_stop" TYPE TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "delivery_status" ALTER COLUMN "download_done" TYPE TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "delivery_status" ALTER COLUMN "current_time" TYPE TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "deploy_status" ALTER COLUMN "deploy_start" TYPE TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "deploy_status" ALTER COLUMN "deploy_stop" TYPE TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "deploy_status" ALTER COLUMN "deploy_done" TYPE TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "deploy_status" ALTER COLUMN "current_time" TYPE TIMESTAMP`);
    }
}
