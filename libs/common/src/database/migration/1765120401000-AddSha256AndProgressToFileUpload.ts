import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSha256AndProgressToFileUpload1765120401000 implements MigrationInterface {
    name = 'AddSha256AndProgressToFileUpload1765120401000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "file_upload" ADD "sha256" text`);
        await queryRunner.query(`ALTER TABLE "file_upload" ADD "progress" integer NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "file_upload" DROP COLUMN "progress"`);
        await queryRunner.query(`ALTER TABLE "file_upload" DROP COLUMN "sha256"`);
    }
}
