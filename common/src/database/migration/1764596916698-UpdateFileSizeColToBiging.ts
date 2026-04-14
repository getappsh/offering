import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateFileSizeColToBiging1764596916698 implements MigrationInterface {
    name = 'UpdateFileSizeColToBiging1764596916698'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "file_upload" ALTER COLUMN "size" TYPE bigint`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Delete release_artifact references first, then delete file_upload rows with size exceeding integer max
        await queryRunner.query(`DELETE FROM "release_artifact" WHERE "file_upload_id" IN (SELECT id FROM "file_upload" WHERE "size" > 2147483647)`);
        await queryRunner.query(`DELETE FROM "file_upload" WHERE "size" > 2147483647`);
        await queryRunner.query(`ALTER TABLE "file_upload" ALTER COLUMN "size" TYPE integer`);
    }

}
