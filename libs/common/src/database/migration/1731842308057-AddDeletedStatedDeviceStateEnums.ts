import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDeletedStatedDeviceStateEnums1731842308057 implements MigrationInterface {
    name = 'AddDeletedStatedDeviceStateEnums1731842308057'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."device_map_state_enum" RENAME TO "device_map_state_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."device_map_state_enum" AS ENUM('offering', 'push', 'import', 'delivery', 'deleted', 'installed', 'uninstalled')`);
        await queryRunner.query(`ALTER TABLE "device_map" ALTER COLUMN "state" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "device_map" ALTER COLUMN "state" TYPE "public"."device_map_state_enum" USING "state"::"text"::"public"."device_map_state_enum"`);
        await queryRunner.query(`ALTER TABLE "device_map" ALTER COLUMN "state" SET DEFAULT 'import'`);
        await queryRunner.query(`DROP TYPE "public"."device_map_state_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."device_component_state_enum" RENAME TO "device_component_state_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."device_component_state_enum" AS ENUM('offering', 'push', 'delivery', 'deleted', 'deploy', 'installed', 'uninstalled')`);
        await queryRunner.query(`ALTER TABLE "device_component" ALTER COLUMN "state" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "device_component" ALTER COLUMN "state" TYPE "public"."device_component_state_enum" USING "state"::"text"::"public"."device_component_state_enum"`);
        await queryRunner.query(`ALTER TABLE "device_component" ALTER COLUMN "state" SET DEFAULT 'delivery'`);
        await queryRunner.query(`DROP TYPE "public"."device_component_state_enum_old"`);
        await queryRunner.query(`ALTER TABLE "device_config" ALTER COLUMN "data" SET DEFAULT '{}'::json`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "device_config" ALTER COLUMN "data" SET DEFAULT '{}'`);
        await queryRunner.query(`CREATE TYPE "public"."device_component_state_enum_old" AS ENUM('offering', 'push', 'delivery', 'deploy', 'installed', 'uninstalled')`);
        await queryRunner.query(`ALTER TABLE "device_component" ALTER COLUMN "state" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "device_component" ALTER COLUMN "state" TYPE "public"."device_component_state_enum_old" USING "state"::"text"::"public"."device_component_state_enum_old"`);
        await queryRunner.query(`ALTER TABLE "device_component" ALTER COLUMN "state" SET DEFAULT 'delivery'`);
        await queryRunner.query(`DROP TYPE "public"."device_component_state_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."device_component_state_enum_old" RENAME TO "device_component_state_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."device_map_state_enum_old" AS ENUM('offering', 'push', 'import', 'delivery', 'installed', 'uninstalled')`);
        await queryRunner.query(`ALTER TABLE "device_map" ALTER COLUMN "state" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "device_map" ALTER COLUMN "state" TYPE "public"."device_map_state_enum_old" USING "state"::"text"::"public"."device_map_state_enum_old"`);
        await queryRunner.query(`ALTER TABLE "device_map" ALTER COLUMN "state" SET DEFAULT 'import'`);
        await queryRunner.query(`DROP TYPE "public"."device_map_state_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."device_map_state_enum_old" RENAME TO "device_map_state_enum"`);
    }

}
