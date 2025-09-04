import { MigrationInterface, QueryRunner } from "typeorm";

export class DeviceAndDeviceTypeManyToMany1756717531369 implements MigrationInterface {
    name = 'DeviceAndDeviceTypeManyToMany1756717531369'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "device" DROP CONSTRAINT "FK_9aa8fcca6a2f86b2638c02fd1bd"`);
        await queryRunner.query(`CREATE TABLE "device_device_types" ("device_id" character varying NOT NULL, "device_type_id" integer NOT NULL, CONSTRAINT "PK_970ed25ed30f21bc7c0f3185852" PRIMARY KEY ("device_id", "device_type_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5c265468ec777c19f42308c769" ON "device_device_types" ("device_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_c57b3ee1596e9a00008da082ba" ON "device_device_types" ("device_type_id") `);
        await queryRunner.query(`ALTER TABLE "device" DROP COLUMN "device_type_id"`);
        await queryRunner.query(`ALTER TABLE "device_device_types" ADD CONSTRAINT "FK_5c265468ec777c19f42308c769b" FOREIGN KEY ("device_id") REFERENCES "device"("ID") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "device_device_types" ADD CONSTRAINT "FK_c57b3ee1596e9a00008da082ba1" FOREIGN KEY ("device_type_id") REFERENCES "device_type"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "device_device_types" DROP CONSTRAINT "FK_c57b3ee1596e9a00008da082ba1"`);
        await queryRunner.query(`ALTER TABLE "device_device_types" DROP CONSTRAINT "FK_5c265468ec777c19f42308c769b"`);
        await queryRunner.query(`ALTER TABLE "device" ADD "device_type_id" integer`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c57b3ee1596e9a00008da082ba"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5c265468ec777c19f42308c769"`);
        await queryRunner.query(`DROP TABLE "device_device_types"`);
        await queryRunner.query(`ALTER TABLE "device" ADD CONSTRAINT "FK_9aa8fcca6a2f86b2638c02fd1bd" FOREIGN KEY ("device_type_id") REFERENCES "device_type"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
    }

}
