import { MigrationInterface, QueryRunner } from "typeorm";

export class LogReportAddFileUploadRelation1755172794365 implements MigrationInterface {
    name = 'LogReportAddFileUploadRelation1755172794365'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bug_report" DROP CONSTRAINT "FK_96672817c65ee3ef934d4b6c4ee"`);
        await queryRunner.query(`ALTER TABLE "bug_report" DROP COLUMN "logs_path"`);
        await queryRunner.query(`ALTER TABLE "bug_report" ADD "start_date" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "bug_report" ADD "end_date" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "bug_report" ADD "log_level" character varying(20)`);
        await queryRunner.query(`ALTER TABLE "bug_report" ADD "file_upload_object_key" character varying`);
        await queryRunner.query(`ALTER TABLE "bug_report" ADD CONSTRAINT "FK_96672817c65ee3ef934d4b6c4ee" FOREIGN KEY ("deviceID") REFERENCES "device"("ID") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bug_report" ADD CONSTRAINT "FK_0964114131bdc4fc493fe609e45" FOREIGN KEY ("file_upload_object_key") REFERENCES "file_upload"("object_key") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.renameTable(`bug_report`, `log_report`);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.renameTable(`log_report`, `bug_report`);
        await queryRunner.query(`ALTER TABLE "bug_report" DROP CONSTRAINT "FK_0964114131bdc4fc493fe609e45"`);
        await queryRunner.query(`ALTER TABLE "bug_report" DROP CONSTRAINT "FK_96672817c65ee3ef934d4b6c4ee"`);
        await queryRunner.query(`ALTER TABLE "bug_report" DROP COLUMN "file_upload_object_key"`);
        await queryRunner.query(`ALTER TABLE "bug_report" DROP COLUMN "log_level"`);
        await queryRunner.query(`ALTER TABLE "bug_report" DROP COLUMN "end_date"`);
        await queryRunner.query(`ALTER TABLE "bug_report" DROP COLUMN "start_date"`);
        await queryRunner.query(`ALTER TABLE "bug_report" ADD "logs_path" character varying`);
        await queryRunner.query(`ALTER TABLE "bug_report" ADD CONSTRAINT "FK_96672817c65ee3ef934d4b6c4ee" FOREIGN KEY ("deviceID") REFERENCES "device"("ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
