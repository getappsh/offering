import { MigrationInterface, QueryRunner } from "typeorm";

export class AddErrorStatusToReleaseStatusEnum1773700000000 implements MigrationInterface {
    name = 'AddErrorStatusToReleaseStatusEnum1773700000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."release_status_enum" ADD VALUE 'error'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // PostgreSQL does not support removing enum values directly.
        // Recreate the enum without 'error' and cast all existing rows back to a safe value.
        await queryRunner.query(`ALTER TYPE "public"."release_status_enum" RENAME TO "release_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."release_status_enum" AS ENUM('draft', 'in_review', 'approved', 'released', 'archived')`);
        await queryRunner.query(`UPDATE "release" SET "status" = 'in_review' WHERE "status" = 'error'`);
        await queryRunner.query(`ALTER TABLE "release" ALTER COLUMN "status" TYPE "public"."release_status_enum" USING "status"::"text"::"public"."release_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."release_status_enum_old"`);
    }
}
