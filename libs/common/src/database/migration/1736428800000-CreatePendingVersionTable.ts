import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePendingVersionTable1736428800000 implements MigrationInterface {
    name = 'CreatePendingVersionTable1736428800000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."pending_version_status_enum" AS ENUM('PENDING', 'ACCEPTED', 'REJECTED')`);
        await queryRunner.query(`CREATE TABLE "pending_version" (
            "id" SERIAL NOT NULL, 
            "created_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), 
            "last_updated_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), 
            "project_name" character varying NOT NULL, 
            "version" character varying NOT NULL, 
            "catalog_id" character varying, 
            "status" "public"."pending_version_status_enum" NOT NULL DEFAULT 'PENDING', 
            "reported_count" integer NOT NULL DEFAULT '1', 
            "first_reported_date" TIMESTAMP WITH TIME ZONE NOT NULL, 
            "last_reported_date" TIMESTAMP WITH TIME ZONE NOT NULL, 
            "reporting_device_ids" jsonb NOT NULL DEFAULT '[]', 
            "metadata" jsonb NOT NULL DEFAULT '{}', 
            "reason" character varying, 
            CONSTRAINT "PK_pending_version_id" PRIMARY KEY ("id")
        )`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_pending_version_project_version" ON "pending_version" ("project_name", "version")`);
        await queryRunner.query(`CREATE INDEX "IDX_pending_version_status" ON "pending_version" ("status")`);
        await queryRunner.query(`CREATE INDEX "IDX_pending_version_last_reported" ON "pending_version" ("last_reported_date")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_pending_version_last_reported"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_pending_version_status"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_pending_version_project_version"`);
        await queryRunner.query(`DROP TABLE "pending_version"`);
        await queryRunner.query(`DROP TYPE "public"."pending_version_status_enum"`);
    }
}
