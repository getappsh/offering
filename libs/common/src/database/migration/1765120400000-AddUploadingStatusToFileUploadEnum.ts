import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUploadingStatusToFileUploadEnum1765120400000 implements MigrationInterface {
    name = 'AddUploadingStatusToFileUploadEnum1765120400000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."file_upload_status_enum" ADD VALUE 'uploading'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Note: PostgreSQL doesn't support removing enum values directly
        // We would need to recreate the enum and update all references
        await queryRunner.query(`ALTER TYPE "public"."file_upload_status_enum" RENAME TO "file_upload_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."file_upload_status_enum" AS ENUM('uploaded', 'pending', 'removed')`);
        await queryRunner.query(`ALTER TABLE "file_upload" ALTER COLUMN "status" TYPE "public"."file_upload_status_enum" USING "status"::"text"::"public"."file_upload_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."file_upload_status_enum_old"`);
    }
}
