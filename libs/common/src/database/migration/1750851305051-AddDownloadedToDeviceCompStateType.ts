import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDownloadedToDeviceCompStateType1750851305051 implements MigrationInterface {
    name = 'AddDownloadedToDeviceCompStateType1750851305051'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."device_component_state_enum" RENAME TO "device_component_state_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."device_component_state_enum" AS ENUM('offering', 'push', 'delivery', 'downloaded', 'deleted', 'deploy', 'installed', 'uninstalled')`);
        await queryRunner.query(`ALTER TABLE "device_component" ALTER COLUMN "state" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "device_component" ALTER COLUMN "state" TYPE "public"."device_component_state_enum" USING "state"::"text"::"public"."device_component_state_enum"`);
        await queryRunner.query(`ALTER TABLE "device_component" ALTER COLUMN "state" SET DEFAULT 'delivery'`);
        await queryRunner.query(`DROP TYPE "public"."device_component_state_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."device_component_state_enum_old" AS ENUM('offering', 'push', 'delivery', 'deleted', 'deploy', 'installed', 'uninstalled')`);
        await queryRunner.query(`ALTER TABLE "device_component" ALTER COLUMN "state" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "device_component" ALTER COLUMN "state" TYPE "public"."device_component_state_enum_old" USING "state"::"text"::"public"."device_component_state_enum_old"`);
        await queryRunner.query(`ALTER TABLE "device_component" ALTER COLUMN "state" SET DEFAULT 'delivery'`);
        await queryRunner.query(`DROP TYPE "public"."device_component_state_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."device_component_state_enum_old" RENAME TO "device_component_state_enum"`);
    }

}
