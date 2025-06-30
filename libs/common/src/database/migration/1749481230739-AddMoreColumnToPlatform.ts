import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMoreColumnToPlatform1749481230739 implements MigrationInterface {
    name = 'AddMoreColumnToPlatform1749481230739'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "platform" ADD "description" character varying`);
        await queryRunner.query(`CREATE TYPE "public"."platform_os_enum" AS ENUM('android', 'windows', 'linux')`);
        await queryRunner.query(`ALTER TABLE "platform" ADD "os" "public"."platform_os_enum"`);
        await queryRunner.query(`ALTER TABLE "platform" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone`);
        await queryRunner.query(`ALTER TABLE "platform" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "platform" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "platform" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "platform" DROP COLUMN "os"`);
        await queryRunner.query(`DROP TYPE "public"."platform_os_enum"`);
        await queryRunner.query(`ALTER TABLE "platform" DROP COLUMN "description"`);
    }

}
