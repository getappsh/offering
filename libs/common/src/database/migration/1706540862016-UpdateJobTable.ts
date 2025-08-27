import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateJobTable1706540862016 implements MigrationInterface {
    name = 'UpdateJobTable1706540862016'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "map_updates_cron_job_time" ALTER COLUMN "start_time" TYPE TIMESTAMP(0) WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "map_updates_cron_job_time" ALTER COLUMN "start_time" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "map_updates_cron_job_time" ADD "job_name" character varying`);
        await queryRunner.query(`DELETE FROM "map_updates_cron_job_time" WHERE "job_name" IS NULL`);
        await queryRunner.query(`ALTER TABLE "map_updates_cron_job_time" ALTER COLUMN job_name SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "map_updates_cron_job_time" ADD "end_time" TIMESTAMP(0) WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "map_updates_cron_job_time" DROP CONSTRAINT "UQ_db4c645940d609249218eff06ef"`);
        await queryRunner.query(`ALTER TABLE "map_updates_cron_job_time" ADD CONSTRAINT "start_time_job_name_unique_constraint" UNIQUE ("start_time", "job_name")`);
        await queryRunner.query(`ALTER TABLE "map_updates_cron_job_time" RENAME TO "cron_job_time_management"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cron_job_time_management" RENAME TO "map_updates_cron_job_time"`);
        await queryRunner.query(`ALTER TABLE "map_updates_cron_job_time" DROP CONSTRAINT "start_time_job_name_unique_constraint"`);
        await queryRunner.query(`ALTER TABLE "map_updates_cron_job_time" ADD CONSTRAINT "UQ_db4c645940d609249218eff06ef" UNIQUE ("start_time")`);
        await queryRunner.query(`ALTER TABLE "map_updates_cron_job_time" DROP COLUMN "end_time"`);
        await queryRunner.query(`ALTER TABLE "map_updates_cron_job_time" DROP COLUMN "job_name"`);
        await queryRunner.query(`ALTER TABLE "map_updates_cron_job_time" ALTER COLUMN "start_time" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "map_updates_cron_job_time" ALTER COLUMN "start_time" TYPE TIMESTAMP WITH TIME ZONE`);
    }

}
