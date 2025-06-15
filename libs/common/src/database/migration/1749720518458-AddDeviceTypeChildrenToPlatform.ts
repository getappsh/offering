import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDeviceTypeChildrenToPlatform1749720518458 implements MigrationInterface {
    name = 'AddDeviceTypeChildrenToPlatform1749720518458'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "platform_device_type" ("platform_name" character varying NOT NULL, "device_type_name" character varying NOT NULL, CONSTRAINT "PK_9a3fb391ab0709fa1527c5712fb" PRIMARY KEY ("platform_name", "device_type_name"))`);
        await queryRunner.query(`CREATE INDEX "IDX_bcb4430f33dd32aea04fd8d642" ON "platform_device_type" ("platform_name") `);
        await queryRunner.query(`CREATE INDEX "IDX_303d9010309c8659b24c72561f" ON "platform_device_type" ("device_type_name") `);
        await queryRunner.query(`ALTER TABLE "platform_device_type" ADD CONSTRAINT "FK_bcb4430f33dd32aea04fd8d642e" FOREIGN KEY ("platform_name") REFERENCES "platform"("name") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "platform_device_type" ADD CONSTRAINT "FK_303d9010309c8659b24c72561fe" FOREIGN KEY ("device_type_name") REFERENCES "device_type"("name") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "platform_device_type" DROP CONSTRAINT "FK_303d9010309c8659b24c72561fe"`);
        await queryRunner.query(`ALTER TABLE "platform_device_type" DROP CONSTRAINT "FK_bcb4430f33dd32aea04fd8d642e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_303d9010309c8659b24c72561f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_bcb4430f33dd32aea04fd8d642"`);
        await queryRunner.query(`DROP TABLE "platform_device_type"`);
    }

}
