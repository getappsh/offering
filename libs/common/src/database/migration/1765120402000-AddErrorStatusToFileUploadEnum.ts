import { MigrationInterface, QueryRunner } from "typeorm";

export class AddErrorStatusToFileUploadEnum1765120402000 implements MigrationInterface {
    name = 'AddErrorStatusToFileUploadEnum1765120402000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."file_upload_status_enum" ADD VALUE 'error'`);
        await queryRunner.query(`ALTER TABLE "file_upload" ADD COLUMN "error" TEXT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "file_upload" DROP COLUMN "error"`);
        // Note: PostgreSQL doesn't support removing enum values directly
        // We would need to recreate the enum and update all references
        await queryRunner.query(`ALTER TYPE "public"."file_upload_status_enum" RENAME TO "file_upload_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."file_upload_status_enum" AS ENUM('uploaded', 'pending', 'uploading', 'removed')`);
        await queryRunner.query(`ALTER TABLE "file_upload" ALTER COLUMN "status" TYPE "public"."file_upload_status_enum" USING "status"::"text"::"public"."file_upload_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."file_upload_status_enum_old"`);
    }
}
