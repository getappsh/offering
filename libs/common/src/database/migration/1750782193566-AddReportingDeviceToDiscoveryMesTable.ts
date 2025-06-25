import { MigrationInterface, QueryRunner } from "typeorm";

export class AddReportingDeviceToDiscoveryMesTable1750782193566 implements MigrationInterface {
    name = 'AddReportingDeviceToDiscoveryMesTable1750782193566'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "discovery_message" ADD "report_dvc_id" character varying`);
        await queryRunner.query(`ALTER TABLE "discovery_message" ADD CONSTRAINT "FK_ce36e370bfcd09312c68a9e2055" FOREIGN KEY ("report_dvc_id") REFERENCES "device"("ID") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "discovery_message" DROP CONSTRAINT "FK_ce36e370bfcd09312c68a9e2055"`);
        await queryRunner.query(`ALTER TABLE "discovery_message" DROP COLUMN "report_dvc_id"`);
    }

}
