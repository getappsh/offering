import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMorePropertiesToPlatformAndDeviceType1750334256937 implements MigrationInterface {
    name = 'AddMorePropertiesToPlatformAndDeviceType1750334256937'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."device_type_os_enum" AS ENUM('android', 'windows', 'linux')`);
        await queryRunner.query(`ALTER TABLE "device_type" ADD "os" "public"."device_type_os_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."device_type_cpuarchitecture_enum" AS ENUM('X86_64', 'ARM64')`);
        await queryRunner.query(`ALTER TABLE "device_type" ADD "cpuArchitecture" "public"."device_type_cpuarchitecture_enum"`);
        await queryRunner.query(`ALTER TABLE "device_type" ADD "cpuCount" integer`);
        await queryRunner.query(`ALTER TABLE "device_type" ADD "memoryMb" integer`);
        await queryRunner.query(`ALTER TABLE "device_type" ADD "diskGb" integer`);
        await queryRunner.query(`CREATE TYPE "public"."device_type_disktype_enum" AS ENUM('HDD', 'SSD', 'NVME')`);
        await queryRunner.query(`ALTER TABLE "device_type" ADD "diskType" "public"."device_type_disktype_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."device_type_networktype_enum" AS ENUM('NAT', 'BRIDGED', 'HOST_ONLY', 'CUSTOM')`);
        await queryRunner.query(`ALTER TABLE "device_type" ADD "networkType" "public"."device_type_networktype_enum"`);
        await queryRunner.query(`ALTER TABLE "device_type" ADD "imageId" character varying`);
        await queryRunner.query(`ALTER TABLE "device_type" ADD "metadata" json`);
        await queryRunner.query(`CREATE TYPE "public"."platform_cpuarchitecture_enum" AS ENUM('X86_64', 'ARM64')`);
        await queryRunner.query(`ALTER TABLE "platform" ADD "cpuArchitecture" "public"."platform_cpuarchitecture_enum"`);
        await queryRunner.query(`ALTER TABLE "platform" ADD "cpuCount" integer`);
        await queryRunner.query(`ALTER TABLE "platform" ADD "memoryMb" integer`);
        await queryRunner.query(`ALTER TABLE "platform" ADD "diskGb" integer`);
        await queryRunner.query(`CREATE TYPE "public"."platform_disktype_enum" AS ENUM('HDD', 'SSD', 'NVME')`);
        await queryRunner.query(`ALTER TABLE "platform" ADD "diskType" "public"."platform_disktype_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."platform_networktype_enum" AS ENUM('NAT', 'BRIDGED', 'HOST_ONLY', 'CUSTOM')`);
        await queryRunner.query(`ALTER TABLE "platform" ADD "networkType" "public"."platform_networktype_enum"`);
        await queryRunner.query(`ALTER TABLE "platform" ADD "imageId" character varying`);
        await queryRunner.query(`ALTER TABLE "platform" ADD "metadata" json`);
        await queryRunner.query(`ALTER TABLE "docs" DROP COLUMN "doc_url"`);
        await queryRunner.query(`ALTER TABLE "docs" ADD "doc_url" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "docs" DROP COLUMN "doc_url"`);
        await queryRunner.query(`ALTER TABLE "docs" ADD "doc_url" character varying`);
        await queryRunner.query(`ALTER TABLE "platform" DROP COLUMN "metadata"`);
        await queryRunner.query(`ALTER TABLE "platform" DROP COLUMN "imageId"`);
        await queryRunner.query(`ALTER TABLE "platform" DROP COLUMN "networkType"`);
        await queryRunner.query(`DROP TYPE "public"."platform_networktype_enum"`);
        await queryRunner.query(`ALTER TABLE "platform" DROP COLUMN "diskType"`);
        await queryRunner.query(`DROP TYPE "public"."platform_disktype_enum"`);
        await queryRunner.query(`ALTER TABLE "platform" DROP COLUMN "diskGb"`);
        await queryRunner.query(`ALTER TABLE "platform" DROP COLUMN "memoryMb"`);
        await queryRunner.query(`ALTER TABLE "platform" DROP COLUMN "cpuCount"`);
        await queryRunner.query(`ALTER TABLE "platform" DROP COLUMN "cpuArchitecture"`);
        await queryRunner.query(`DROP TYPE "public"."platform_cpuarchitecture_enum"`);
        await queryRunner.query(`ALTER TABLE "device_type" DROP COLUMN "metadata"`);
        await queryRunner.query(`ALTER TABLE "device_type" DROP COLUMN "imageId"`);
        await queryRunner.query(`ALTER TABLE "device_type" DROP COLUMN "networkType"`);
        await queryRunner.query(`DROP TYPE "public"."device_type_networktype_enum"`);
        await queryRunner.query(`ALTER TABLE "device_type" DROP COLUMN "diskType"`);
        await queryRunner.query(`DROP TYPE "public"."device_type_disktype_enum"`);
        await queryRunner.query(`ALTER TABLE "device_type" DROP COLUMN "diskGb"`);
        await queryRunner.query(`ALTER TABLE "device_type" DROP COLUMN "memoryMb"`);
        await queryRunner.query(`ALTER TABLE "device_type" DROP COLUMN "cpuCount"`);
        await queryRunner.query(`ALTER TABLE "device_type" DROP COLUMN "cpuArchitecture"`);
        await queryRunner.query(`DROP TYPE "public"."device_type_cpuarchitecture_enum"`);
        await queryRunner.query(`ALTER TABLE "device_type" DROP COLUMN "os"`);
        await queryRunner.query(`DROP TYPE "public"."device_type_os_enum"`);
    }

}
