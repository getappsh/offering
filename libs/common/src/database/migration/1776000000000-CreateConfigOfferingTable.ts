import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateConfigOfferingTable1776000000000 implements MigrationInterface {
    name = 'CreateConfigOfferingTable1776000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "config_offering" (
                "id" SERIAL NOT NULL,
                "createdDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "lastUpdatedDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "device_ID" character varying NOT NULL,
                "config_device_id" character varying NOT NULL,
                CONSTRAINT "device_config_offering_unique_constraint" UNIQUE ("device_ID", "config_device_id"),
                CONSTRAINT "PK_config_offering" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "config_offering"
            ADD CONSTRAINT "FK_config_offering_device"
            FOREIGN KEY ("device_ID") REFERENCES "device"("ID") ON DELETE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "config_offering" DROP CONSTRAINT "FK_config_offering_device"`);
        await queryRunner.query(`DROP TABLE "config_offering"`);
    }
}
