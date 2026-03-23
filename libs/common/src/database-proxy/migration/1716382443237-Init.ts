import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1716382443237 implements MigrationInterface {
    name = 'Init1716382443237'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."delivery_item_status_enum" AS ENUM('start', 'inProgress', 'done', 'error')`);
        await queryRunner.query(`CREATE TABLE "delivery_item" ("id" SERIAL NOT NULL, "createdDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "lastUpdatedDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "item_key" character varying NOT NULL, "meta_data" character varying, "status" "public"."delivery_item_status_enum" NOT NULL DEFAULT 'start', "err_msg" character varying, "size" integer, "path" character varying, "progress" integer NOT NULL DEFAULT '0', "deliveryCatalogId" character varying, CONSTRAINT "UQ_cc24971c796fcdd55c487a2dad6" UNIQUE ("item_key", "deliveryCatalogId"), CONSTRAINT "PK_2cb006c56a92e21e08069135fc4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."delivery_status_enum" AS ENUM('start', 'inProgress', 'done', 'error')`);
        await queryRunner.query(`CREATE TABLE "delivery" ("catalog_id" character varying NOT NULL, "createdDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "lastUpdatedDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "device_id" character varying NOT NULL, "status" "public"."delivery_status_enum" NOT NULL DEFAULT 'start', "err_msg" character varying, "size" integer, CONSTRAINT "PK_8f466b0d171be17b87993904ef2" PRIMARY KEY ("catalog_id"))`);
        await queryRunner.query(`ALTER TABLE "delivery_item" ADD CONSTRAINT "FK_c3a587256cfd44448bac6080f0b" FOREIGN KEY ("deliveryCatalogId") REFERENCES "delivery"("catalog_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "delivery_item" DROP CONSTRAINT "FK_c3a587256cfd44448bac6080f0b"`);
        await queryRunner.query(`DROP TABLE "delivery"`);
        await queryRunner.query(`DROP TYPE "public"."delivery_status_enum"`);
        await queryRunner.query(`DROP TABLE "delivery_item"`);
        await queryRunner.query(`DROP TYPE "public"."delivery_item_status_enum"`);
    }

}
