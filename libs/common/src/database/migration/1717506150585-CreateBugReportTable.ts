import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBugReportTable1717506150585 implements MigrationInterface {
    name = 'CreateBugReportTable1717506150585'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "bug_report" ("id" SERIAL NOT NULL, "createdDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "lastUpdatedDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "description" character varying, "agent_version" character varying NOT NULL, "logs_path" character varying, "deviceID" character varying NOT NULL, CONSTRAINT "PK_2885f11af36e1f953136d36e05f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "bug_report" ADD CONSTRAINT "FK_96672817c65ee3ef934d4b6c4ee" FOREIGN KEY ("deviceID") REFERENCES "device"("ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bug_report" DROP CONSTRAINT "FK_96672817c65ee3ef934d4b6c4ee"`);
        await queryRunner.query(`DROP TABLE "bug_report"`);
    }

}
