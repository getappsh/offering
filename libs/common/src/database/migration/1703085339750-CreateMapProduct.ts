import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMapProduct1703085339750 implements MigrationInterface {
    name = 'CreateMapProduct1703085339750'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "map_product" ("id" character varying NOT NULL, "create_date" TIMESTAMP NOT NULL DEFAULT now(), "lastUpdatedDate" TIMESTAMP NOT NULL DEFAULT now(), "product_id" character varying NOT NULL, "product_name" character varying, "product_version" character varying, "product_type" character varying, "product_sub_type" character varying, "description" character varying, "imaging_time_begin_UTC" TIMESTAMP WITH TIME ZONE, "imaging_time_end_UTC" TIMESTAMP WITH TIME ZONE, "max_resolution_deg" integer, "footprint" character varying NOT NULL, "transparency" character varying, "region" character varying, "ingestionDate" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_7dcd3fe698bbfefa46e14a4ae9d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "map_id_product_id_unique" ON "map_product" ("id", "product_id") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."map_id_product_id_unique"`);
        await queryRunner.query(`DROP TABLE "map_product"`);
    }

}
