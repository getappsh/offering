import { MigrationInterface, QueryRunner } from "typeorm";

export class UploadDockerImage1734352266907 implements MigrationInterface {
    name = 'UploadDockerImage1734352266907'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "upload_version" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "upload_version" RENAME COLUMN "s3_url" TO "url"`);
        await queryRunner.query(`CREATE TYPE "public"."upload_version_asset_type_enum" AS ENUM('artifact', 'docker_image')`);
        await queryRunner.query(`ALTER TABLE "upload_version" ADD "asset_type" "public"."upload_version_asset_type_enum" NOT NULL DEFAULT 'artifact'`);
       
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "upload_version" DROP COLUMN "asset_type"`);
        await queryRunner.query(`DROP TYPE "public"."upload_version_asset_type_enum"`);
        await queryRunner.query(`ALTER TABLE "upload_version" RENAME COLUMN "url" TO "s3_url"`);
        await queryRunner.query(`ALTER TABLE "upload_version" ADD "id" integer`);
    }

}
