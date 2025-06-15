import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMoreColToDeviceTable1749571566537 implements MigrationInterface {
    name = 'AddMoreColToDeviceTable1749571566537'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "device" ADD "platform_name" character varying`);
        await queryRunner.query(`ALTER TABLE "device" ADD "device_type" character varying`);
        await queryRunner.query(`ALTER TABLE "device" ADD "parent" character varying`);
        await queryRunner.query(`ALTER TABLE "device" ADD CONSTRAINT "FK_447e82cd63b48446a2a61246840" FOREIGN KEY ("platform_name") REFERENCES "platform"("name") ON DELETE NO ACTION ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "device" ADD CONSTRAINT "FK_f14bf5d831e5b473ad2f2e68ab6" FOREIGN KEY ("device_type") REFERENCES "device_type"("name") ON DELETE NO ACTION ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "device" ADD CONSTRAINT "FK_11be820b6dc488fc53367659f02" FOREIGN KEY ("parent") REFERENCES "device"("ID") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "device" DROP CONSTRAINT "FK_11be820b6dc488fc53367659f02"`);
        await queryRunner.query(`ALTER TABLE "device" DROP CONSTRAINT "FK_f14bf5d831e5b473ad2f2e68ab6"`);
        await queryRunner.query(`ALTER TABLE "device" DROP CONSTRAINT "FK_447e82cd63b48446a2a61246840"`);
        await queryRunner.query(`ALTER TABLE "device" DROP COLUMN "parent"`);
        await queryRunner.query(`ALTER TABLE "device" DROP COLUMN "device_type"`);
        await queryRunner.query(`ALTER TABLE "device" DROP COLUMN "platform_name"`);
    }

}
