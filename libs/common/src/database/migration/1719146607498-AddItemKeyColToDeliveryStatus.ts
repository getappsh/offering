import { MigrationInterface, QueryRunner } from "typeorm";

export class AddItemKeyColToDeliveryStatus1719146607498 implements MigrationInterface {
    name = 'AddItemKeyColToDeliveryStatus1719146607498'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "delivery_status" DROP CONSTRAINT "UQ_deviceID_catalogId"`);
        await queryRunner.query(`ALTER TABLE "delivery_status" ADD "item_key" character varying NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "delivery_status" ADD CONSTRAINT "UQ_deviceID_catalogId_itemKey" UNIQUE ("deviceID", "catalogId", "item_key")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "delivery_status" DROP CONSTRAINT "UQ_deviceID_catalogId_itemKey"`);
        await queryRunner.query(`ALTER TABLE "delivery_status" DROP COLUMN "item_key"`);
        await queryRunner.query(`ALTER TABLE "delivery_status" ADD CONSTRAINT "UQ_deviceID_catalogId" UNIQUE ("catalogId", "deviceID")`);
    }

}
