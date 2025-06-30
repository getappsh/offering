import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDeliveryEntity1704730927100 implements MigrationInterface {
    name = 'CreateDeliveryEntity1704730927100'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "delivery"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."delivery_status_enum"`);
        
        await queryRunner.query(`CREATE TYPE "public"."delivery_status_enum" AS ENUM('start', 'inProgress', 'done', 'error')`);
        await queryRunner.query(`CREATE TABLE "delivery" ("catalog_id" character varying NOT NULL, "status" "public"."delivery_status_enum" NOT NULL DEFAULT 'start', "device_id" character varying NOT NULL, "path" character varying, "progress" integer NOT NULL DEFAULT '0', "createdDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "lastUpdatedDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_8f466b0d171be17b87993904ef2" PRIMARY KEY ("catalog_id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "delivery"`);
        await queryRunner.query(`DROP TYPE "public"."delivery_status_enum"`);
    }

}
