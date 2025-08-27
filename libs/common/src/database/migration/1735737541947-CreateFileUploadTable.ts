import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateFileUploadTable1735737541947 implements MigrationInterface {
    name = 'CreateFileUploadTable1735737541947'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."file_upload_status_enum" AS ENUM('uploaded', 'pending', 'removed')`);
        await queryRunner.query(`CREATE TABLE "file_upload" ("id" SERIAL NOT NULL, "createdDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "lastUpdatedDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "file_name" character varying NOT NULL, "user_id" character varying NOT NULL, "object_key" character varying NOT NULL, "status" "public"."file_upload_status_enum" NOT NULL DEFAULT 'pending', "bucket_name" character varying NOT NULL, "size" integer, "content_type" character varying, "upload_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_bb8460e39fcad3aaa44d1d7e5d3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_89bbf78acda05d900ade2597db" ON "file_upload" ("object_key") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_89bbf78acda05d900ade2597db"`);
        await queryRunner.query(`DROP TABLE "file_upload"`);
        await queryRunner.query(`DROP TYPE "public"."file_upload_status_enum"`);
    }

}
