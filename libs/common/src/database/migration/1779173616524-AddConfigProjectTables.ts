import { MigrationInterface, QueryRunner } from "typeorm";

export class AddConfigProjectTables1779173616524 implements MigrationInterface {
    name = 'AddConfigProjectTables1779173616524'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add config / config_map to project type enum (requires commit/restart)
        await queryRunner.commitTransaction();
        await queryRunner.query(`ALTER TYPE "public"."project_project_type_enum" ADD VALUE IF NOT EXISTS 'config'`);
        await queryRunner.query(`ALTER TYPE "public"."project_project_type_enum" ADD VALUE IF NOT EXISTS 'config_map'`);
        await queryRunner.startTransaction();

        await queryRunner.query(`CREATE TYPE "public"."config_revision_status_enum" AS ENUM('draft', 'active', 'archived')`);
        await queryRunner.query(`CREATE TABLE "config_revision" ("id" SERIAL NOT NULL, "project_id" integer NOT NULL, "revision_number" integer NOT NULL, "status" "public"."config_revision_status_enum" NOT NULL DEFAULT 'draft', "applied_by" character varying, "applied_at" TIMESTAMP WITH TIME ZONE, "sem_ver" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_be6a8b39571d45525c965fc5e2b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "config_group" ("id" SERIAL NOT NULL, "revision_id" integer NOT NULL, "name" character varying NOT NULL, "display_name" character varying, "is_global" boolean NOT NULL DEFAULT false, "git_file_path" character varying, "yaml_content" text, "sensitive_keys" jsonb NOT NULL DEFAULT '[]', "position" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_ce1b247251d4942d8cd0c3dc2b1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "config_map_association" ("id" SERIAL NOT NULL, "config_map_project_id" integer NOT NULL, "device_type_id" integer, "device_id" character varying, "config_project_id" integer, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_84dd2e326ca912669e3578f2903" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "config_group" ADD CONSTRAINT "FK_80df396e5d40e8d29dc5c95a4c8" FOREIGN KEY ("revision_id") REFERENCES "config_revision"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "config_revision" ADD CONSTRAINT "FK_a0d96628e2b9035c08cd3b26e87" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "config_map_association" ADD CONSTRAINT "FK_833d977911ccdad3aa26d6e2752" FOREIGN KEY ("config_map_project_id") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "config_map_association" ADD CONSTRAINT "FK_b7cf9df6dae4322e130b5a3dc8a" FOREIGN KEY ("device_type_id") REFERENCES "device_type"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "config_map_association" ADD CONSTRAINT "FK_63aa4e2899c3c8f9fe38f2d2d0b" FOREIGN KEY ("device_id") REFERENCES "device"("ID") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "config_map_association" ADD CONSTRAINT "FK_087db2c613eec33d138eb90d13d" FOREIGN KEY ("config_project_id") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "config_map_association"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "config_group"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "config_revision"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."config_revision_status_enum"`);
        // Note: PostgreSQL does not support removing enum values, so 'config' and
        // 'config_map' will remain in project_project_type_enum.
    }

}
