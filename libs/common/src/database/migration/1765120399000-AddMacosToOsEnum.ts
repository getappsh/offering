import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMacosToOsEnum1765120399000 implements MigrationInterface {
    name = 'AddMacosToOsEnum1765120399000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add 'macos' to platform_os_enum
        await queryRunner.query(`ALTER TYPE "public"."platform_os_enum" RENAME TO "platform_os_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."platform_os_enum" AS ENUM('android', 'windows', 'linux', 'macos')`);
        await queryRunner.query(`ALTER TABLE "platform" ALTER COLUMN "os" TYPE "public"."platform_os_enum" USING "os"::"text"::"public"."platform_os_enum"`);
        await queryRunner.query(`DROP TYPE "public"."platform_os_enum_old"`);

        // Add 'macos' to device_type_os_enum
        await queryRunner.query(`ALTER TYPE "public"."device_type_os_enum" RENAME TO "device_type_os_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."device_type_os_enum" AS ENUM('android', 'windows', 'linux', 'macos')`);
        await queryRunner.query(`ALTER TABLE "device_type" ALTER COLUMN "os" TYPE "public"."device_type_os_enum" USING "os"::"text"::"public"."device_type_os_enum"`);
        await queryRunner.query(`DROP TYPE "public"."device_type_os_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revert device_type_os_enum
        await queryRunner.query(`CREATE TYPE "public"."device_type_os_enum_old" AS ENUM('android', 'windows', 'linux')`);
        await queryRunner.query(`ALTER TABLE "device_type" ALTER COLUMN "os" TYPE "public"."device_type_os_enum_old" USING "os"::"text"::"public"."device_type_os_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."device_type_os_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."device_type_os_enum_old" RENAME TO "device_type_os_enum"`);

        // Revert platform_os_enum
        await queryRunner.query(`CREATE TYPE "public"."platform_os_enum_old" AS ENUM('android', 'windows', 'linux')`);
        await queryRunner.query(`ALTER TABLE "platform" ALTER COLUMN "os" TYPE "public"."platform_os_enum_old" USING "os"::"text"::"public"."platform_os_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."platform_os_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."platform_os_enum_old" RENAME TO "platform_os_enum"`);
    }

}
