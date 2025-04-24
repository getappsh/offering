import { MigrationInterface, QueryRunner } from "typeorm";

export class DeviceComponentOnDeleteCascade1739706844922 implements MigrationInterface {
    name = 'DeviceComponentOnDeleteCascade1739706844922'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "device_component" DROP CONSTRAINT "FK_3bcc20114f5c712d46467eeab2e"`);
        await queryRunner.query(`ALTER TABLE "device_component" DROP CONSTRAINT "FK_1f163ac3d48a67c9bf6a3d247f1"`);
        await queryRunner.query(`ALTER TABLE "device_component" ADD CONSTRAINT "FK_1f163ac3d48a67c9bf6a3d247f1" FOREIGN KEY ("device_ID") REFERENCES "device"("ID") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "device_component" ADD CONSTRAINT "FK_3bcc20114f5c712d46467eeab2e" FOREIGN KEY ("release_catalog_id") REFERENCES "release"("catalog_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "device_component" DROP CONSTRAINT "FK_3bcc20114f5c712d46467eeab2e"`);
        await queryRunner.query(`ALTER TABLE "device_component" DROP CONSTRAINT "FK_1f163ac3d48a67c9bf6a3d247f1"`);
        await queryRunner.query(`ALTER TABLE "device_component" ADD CONSTRAINT "FK_1f163ac3d48a67c9bf6a3d247f1" FOREIGN KEY ("device_ID") REFERENCES "device"("ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "device_component" ADD CONSTRAINT "FK_3bcc20114f5c712d46467eeab2e" FOREIGN KEY ("release_catalog_id") REFERENCES "release"("catalog_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
