import { MigrationInterface, QueryRunner } from "typeorm";

export class AddManageCronJobTable1730732959163 implements MigrationInterface {
    name = 'AddManageCronJobTable1730732959163'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "cron_job_time_management" ("id" SERIAL NOT NULL, "job_name" character varying NOT NULL, "start_time" TIMESTAMP(0) WITH TIME ZONE NOT NULL, "end_time" TIMESTAMP(0) WITH TIME ZONE, CONSTRAINT "start_time_job_name_unique_constraint" UNIQUE ("start_time", "job_name"), CONSTRAINT "PK_90ff2c565e962a4e22531240580" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "cron_job_time_management"`);
    }

}
