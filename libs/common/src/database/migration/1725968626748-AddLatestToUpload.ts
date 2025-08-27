import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLatestToUpload1725968626748 implements MigrationInterface {
    name = 'AddLatestToUpload1725968626748'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "upload_version" ADD "latest" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "upload_version" DROP COLUMN "latest"`);
    }

}
