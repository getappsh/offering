import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMapConfigEntity1705415939349 implements MigrationInterface {
    name = 'AddMapConfigEntity1705415939349'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "map_configs" ("id" SERIAL NOT NULL, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "lastUpdatedDate" TIMESTAMP NOT NULL DEFAULT now(), "delivery_timeout" integer, "max_map_size_meter" integer, "max_parallel_download" integer, "download_retry" integer, "download_timeout" integer, "inventory_job_periodic_mins" integer, "map_conf_periodic_mins" integer, "min_space_byte" integer, CONSTRAINT "PK_a5ec19b0d57a450819c28330ae9" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "map_configs"`);
    }

}
