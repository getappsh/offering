import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDeliveryCacheModule1718897903522 implements MigrationInterface {
    name = 'AddDeliveryCacheModule1718897903522'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."delivery_item_status_enum" AS ENUM('start', 'inProgress', 'done', 'error')`);
        await queryRunner.query(`CREATE TYPE "public"."delivery_item_hash_algorithm_enum" AS ENUM('SHA256Hex', 'SHA256Base64')`);
        await queryRunner.query(`CREATE TABLE "delivery_item" ("id" SERIAL NOT NULL, "createdDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "lastUpdatedDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "item_key" character varying NOT NULL, "meta_data" character varying, "status" "public"."delivery_item_status_enum" NOT NULL DEFAULT 'start', "err_code" character varying, "err_msg" character varying, "size" integer, "path" character varying, "progress" integer NOT NULL DEFAULT '0', "hash" character varying, "hash_algorithm" "public"."delivery_item_hash_algorithm_enum", "deliveryCatalogId" character varying, CONSTRAINT "UQ_cc24971c796fcdd55c487a2dad6" UNIQUE ("item_key", "deliveryCatalogId"), CONSTRAINT "PK_2cb006c56a92e21e08069135fc4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cache_config" ("id" SERIAL NOT NULL, "createdDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "lastUpdatedDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "configs" jsonb NOT NULL, CONSTRAINT "PK_40f1780fc716b2397d5661bc8be" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "delivery" ADD "err_code" character varying`);
        await queryRunner.query(`ALTER TABLE "delivery" ADD "err_msg" character varying`);
        await queryRunner.query(`ALTER TABLE "delivery" ADD "size" integer`);
        await queryRunner.query(`ALTER TABLE "delivery_item" ADD CONSTRAINT "FK_c3a587256cfd44448bac6080f0b" FOREIGN KEY ("deliveryCatalogId") REFERENCES "delivery"("catalog_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "delivery_item" DROP CONSTRAINT "FK_c3a587256cfd44448bac6080f0b"`);
        await queryRunner.query(`ALTER TABLE "delivery" DROP COLUMN "size"`);
        await queryRunner.query(`ALTER TABLE "delivery" DROP COLUMN "err_msg"`);
        await queryRunner.query(`ALTER TABLE "delivery" DROP COLUMN "err_code"`);
        await queryRunner.query(`DROP TABLE "cache_config"`);
        await queryRunner.query(`DROP TABLE "delivery_item"`);
        await queryRunner.query(`DROP TYPE "public"."delivery_item_hash_algorithm_enum"`);
        await queryRunner.query(`DROP TYPE "public"."delivery_item_status_enum"`);
    }

}
