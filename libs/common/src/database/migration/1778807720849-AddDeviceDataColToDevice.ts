import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDeviceDataColToDevice1778807720849 implements MigrationInterface {
    name = 'AddDeviceDataColToDevice1778807720849'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "device" ADD "device_data" jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "device" DROP COLUMN "device_data"`);
    }

}
