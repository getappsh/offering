import { MigrationInterface, QueryRunner } from "typeorm";

export class ComponentOfferingEntity1726393923984 implements MigrationInterface {
    name = 'ComponentOfferingEntity1726393923984'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."component_offering_action_enum" AS ENUM('offering', 'push')`);
        await queryRunner.query(`CREATE TABLE "component_offering" ("id" SERIAL NOT NULL, "createdDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "lastUpdatedDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "action" "public"."component_offering_action_enum" NOT NULL DEFAULT 'offering', "device_ID" character varying NOT NULL, "component_catalog_id" character varying NOT NULL, CONSTRAINT "component_offering_unique_constraint" UNIQUE ("device_ID", "component_catalog_id"), CONSTRAINT "PK_45292a2b999ae5a37c7f70b9dbc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "component_offering" ADD CONSTRAINT "FK_069f79bc44a1ab451879e9b4e6c" FOREIGN KEY ("device_ID") REFERENCES "device"("ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "component_offering" ADD CONSTRAINT "FK_0354d08076030bc065acd0c2c00" FOREIGN KEY ("component_catalog_id") REFERENCES "upload_version"("catalog_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "component_offering" DROP CONSTRAINT "FK_0354d08076030bc065acd0c2c00"`);
        await queryRunner.query(`ALTER TABLE "component_offering" DROP CONSTRAINT "FK_069f79bc44a1ab451879e9b4e6c"`);
        await queryRunner.query(`DROP TABLE "component_offering"`);
        await queryRunner.query(`DROP TYPE "public"."component_offering_action_enum"`);
    }

}
