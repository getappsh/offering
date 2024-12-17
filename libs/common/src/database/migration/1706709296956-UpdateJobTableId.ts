import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateJobTableId1706709296956 implements MigrationInterface {
    name = 'UpdateJobTableId1706709296956'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "cron_job_time_management_id_seq" OWNED BY "cron_job_time_management"."id"`);
        await queryRunner.query(`ALTER TABLE "cron_job_time_management" ALTER COLUMN "id" SET DEFAULT nextval('"cron_job_time_management_id_seq"')`);
        await queryRunner.query(`DELETE FROM "cron_job_time_management"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cron_job_time_management" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "cron_job_time_management_id_seq"`);
    }

}
