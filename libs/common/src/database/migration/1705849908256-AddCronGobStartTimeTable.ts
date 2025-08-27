import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCronGobStartTimeTable1705849908256 implements MigrationInterface {
    name = 'AddCronGobStartTimeTable1705849908256'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "map_updates_cron_job_time" ("id" SERIAL NOT NULL, "start_time" TIMESTAMP(0) NOT NULL, CONSTRAINT "UQ_db4c645940d609249218eff06ef" UNIQUE ("start_time"), CONSTRAINT "PK_658bbd280068005f901edeb909a" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "map_updates_cron_job_time"`);
    }

}
