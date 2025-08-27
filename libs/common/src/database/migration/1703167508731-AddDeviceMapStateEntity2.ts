import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDeviceMapStateEntity21703167508731 implements MigrationInterface {
    name = 'AddDeviceMapStateEntity21703167508731'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "device_map" DROP CONSTRAINT "FK_3c49ab81b3b5b0f728d3a668c80"`);
        await queryRunner.query(`ALTER TABLE "device_map" DROP CONSTRAINT "FK_b22a81b93cb5ef546234515886c"`);
        await queryRunner.query(`ALTER TYPE "public"."device_map_state_state_enum" RENAME TO "device_map_state_state_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."device_map_state_enum" AS ENUM('import', 'delivery', 'installed', 'uninstalled')`);
        await queryRunner.query(`ALTER TABLE "device_map" ALTER COLUMN "state" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "device_map" ALTER COLUMN "state" TYPE "public"."device_map_state_enum" USING "state"::"text"::"public"."device_map_state_enum"`);
        await queryRunner.query(`ALTER TABLE "device_map" ALTER COLUMN "state" SET DEFAULT 'import'`);
        await queryRunner.query(`DROP TYPE "public"."device_map_state_state_enum_old"`);
        await queryRunner.query(`ALTER TABLE "device_map" ADD CONSTRAINT "FK_b82e4a49e78c4d2c9125039609d" FOREIGN KEY ("device_ID") REFERENCES "device"("ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "device_map" ADD CONSTRAINT "FK_4b78115c58fadb87995b90840c5" FOREIGN KEY ("map_catalog_id") REFERENCES "map"("catalog_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "device_map" DROP CONSTRAINT "FK_4b78115c58fadb87995b90840c5"`);
        await queryRunner.query(`ALTER TABLE "device_map" DROP CONSTRAINT "FK_b82e4a49e78c4d2c9125039609d"`);
        await queryRunner.query(`CREATE TYPE "public"."device_map_state_state_enum_old" AS ENUM('import', 'delivery', 'installed', 'uninstalled')`);
        await queryRunner.query(`ALTER TABLE "device_map" ALTER COLUMN "state" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "device_map" ALTER COLUMN "state" TYPE "public"."device_map_state_state_enum_old" USING "state"::"text"::"public"."device_map_state_state_enum_old"`);
        await queryRunner.query(`ALTER TABLE "device_map" ALTER COLUMN "state" SET DEFAULT 'import'`);
        await queryRunner.query(`DROP TYPE "public"."device_map_state_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."device_map_state_state_enum_old" RENAME TO "device_map_state_state_enum"`);
        await queryRunner.query(`ALTER TABLE "device_map" ADD CONSTRAINT "FK_b22a81b93cb5ef546234515886c" FOREIGN KEY ("device_ID") REFERENCES "device"("ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "device_map" ADD CONSTRAINT "FK_3c49ab81b3b5b0f728d3a668c80" FOREIGN KEY ("map_catalog_id") REFERENCES "map"("catalog_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
