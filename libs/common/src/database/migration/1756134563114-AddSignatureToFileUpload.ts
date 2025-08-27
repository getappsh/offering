import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSignatureToFileUpload1756134563114 implements MigrationInterface {
    name = 'AddSignatureToFileUpload1756134563114'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "file_upload" ADD "signature" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "file_upload" DROP COLUMN "signature"`);
    }

}
