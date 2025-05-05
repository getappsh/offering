import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateReleaseTable1736169582300 implements MigrationInterface {
    name = 'CreateReleaseTable1736169582300'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."release_artifact_type_enum" AS ENUM('file', 'docker_image')`);
        await queryRunner.query(`CREATE TABLE "release_artifact" ("id" SERIAL NOT NULL, "createdDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "lastUpdatedDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "artifact_name" character varying, "type" "public"."release_artifact_type_enum" NOT NULL DEFAULT 'file', "docker_image_url" character varying, "is_installation_file" boolean NOT NULL DEFAULT false, "metadata" jsonb NOT NULL DEFAULT '{}', "release_id" character varying NOT NULL, "file_upload_id" integer, CONSTRAINT "REL_6dfcc10729377dbac4fa278f16" UNIQUE ("file_upload_id"), CONSTRAINT "CHK_5a7481a73c710465cea1515ad7" CHECK (((file_upload_id IS NOT NULL and type = 'file') OR (docker_image_url IS NOT NULL and type = 'docker_image'))), CONSTRAINT "PK_24a0a793a2a284125b705380f46" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "unique_release_docker_image" ON "release_artifact" ("release_id", "docker_image_url") WHERE docker_image_url IS NOT NULL and type = 'docker_image'`);
        await queryRunner.query(`CREATE UNIQUE INDEX "unique_release_fileupload" ON "release_artifact" ("release_id", "file_upload_id") WHERE file_upload_id IS NOT NULL and type = 'file'`);
        await queryRunner.query(`CREATE TYPE "public"."release_status_enum" AS ENUM('draft', 'in_review', 'approved', 'released', 'archived')`);
        await queryRunner.query(`CREATE TABLE "release" ("catalog_id" character varying NOT NULL, "version" character varying NOT NULL, "name" character varying, "status" "public"."release_status_enum" NOT NULL DEFAULT 'draft', "release_notes" character varying, "metadata" jsonb NOT NULL DEFAULT '{}', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "project_id" integer NOT NULL, CONSTRAINT "PK_0c583e1e60489974f0f267e7533" PRIMARY KEY ("catalog_id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_4c32df2ddc85069356df0d5988" ON "release" ("project_id", "version") `);
        await queryRunner.query(`ALTER TABLE "release_artifact" ADD CONSTRAINT "FK_6c1e9ed04038e5e9888fc73b717" FOREIGN KEY ("release_id") REFERENCES "release"("catalog_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "release_artifact" ADD CONSTRAINT "FK_6dfcc10729377dbac4fa278f16f" FOREIGN KEY ("file_upload_id") REFERENCES "file_upload"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "release" ADD CONSTRAINT "FK_26aa91a0fafe22a6881b172d9a7" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "release" DROP CONSTRAINT "FK_26aa91a0fafe22a6881b172d9a7"`);
        await queryRunner.query(`ALTER TABLE "release_artifact" DROP CONSTRAINT "FK_6dfcc10729377dbac4fa278f16f"`);
        await queryRunner.query(`ALTER TABLE "release_artifact" DROP CONSTRAINT "FK_6c1e9ed04038e5e9888fc73b717"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4c32df2ddc85069356df0d5988"`);
        await queryRunner.query(`DROP TABLE "release"`);
        await queryRunner.query(`DROP TYPE "public"."release_status_enum"`);
        await queryRunner.query(`DROP INDEX "public"."unique_release_fileupload"`);
        await queryRunner.query(`DROP INDEX "public"."unique_release_docker_image"`);
        await queryRunner.query(`DROP TABLE "release_artifact"`);
        await queryRunner.query(`DROP TYPE "public"."release_artifact_type_enum"`);
    }

}
