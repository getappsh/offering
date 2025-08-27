import { MigrationInterface, QueryRunner } from "typeorm";

export class OnPlatformAndDeviceTypeDelete1752401390294 implements MigrationInterface {
    name = 'OnPlatformAndDeviceTypeDelete1752401390294'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "device" DROP CONSTRAINT "FK_9aa8fcca6a2f86b2638c02fd1bd"`);
        await queryRunner.query(`ALTER TABLE "device" DROP CONSTRAINT "FK_a4431527b507da2834b9cd02fc9"`);
        await queryRunner.query(`ALTER TABLE "device" ADD CONSTRAINT "FK_a4431527b507da2834b9cd02fc9" FOREIGN KEY ("platform_id") REFERENCES "platform"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "device" ADD CONSTRAINT "FK_9aa8fcca6a2f86b2638c02fd1bd" FOREIGN KEY ("device_type_id") REFERENCES "device_type"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "device" DROP CONSTRAINT "FK_9aa8fcca6a2f86b2638c02fd1bd"`);
        await queryRunner.query(`ALTER TABLE "device" DROP CONSTRAINT "FK_a4431527b507da2834b9cd02fc9"`);
        await queryRunner.query(`ALTER TABLE "device" ADD CONSTRAINT "FK_a4431527b507da2834b9cd02fc9" FOREIGN KEY ("platform_id") REFERENCES "platform"("id") ON DELETE NO ACTION ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "device" ADD CONSTRAINT "FK_9aa8fcca6a2f86b2638c02fd1bd" FOREIGN KEY ("device_type_id") REFERENCES "device_type"("id") ON DELETE NO ACTION ON UPDATE CASCADE`);
    }

}
