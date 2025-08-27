import { MigrationInterface, QueryRunner } from "typeorm";

export class AddToProductEntityOwnIdCol1707218519323 implements MigrationInterface {
    name = 'AddToProductEntityOwnIdCol1707218519323'

    public async up(queryRunner: QueryRunner): Promise<void> {
    //     await queryRunner.query(`CREATE TABLE public."map_backup" (
    //         catalog_id varchar NOT NULL,
    //         file_name varchar NULL,
    //         zoom_level int4 NULL,
    //         create_date timestamp NOT NULL DEFAULT now(),
    //         bounding_box varchar NULL,
    //         package_url varchar NULL,
    //         status public."map_status_enum" NOT NULL DEFAULT 'Start'::map_status_enum,
    //         "lastUpdatedDate" timestamp NOT NULL DEFAULT now(),
    //         progress int4 NULL,
    //         export_start timestamptz NULL,
    //         export_end timestamptz NULL,
    //         map_product varchar NULL,
    //         "size" int8 NULL,
    //         error_reason varchar NULL,
    //         job_id int8 NULL,
    //         max_resolution float8 NULL,
    //         is_updated bool NOT NULL DEFAULT true,
    //         "last_check is_obsolete" timestamptz NULL,
    //         foot_print varchar NULL,
    //         CONSTRAINT "PK_eece6afcab5df8c3b10b6b11cbc" PRIMARY KEY (catalog_id),
    //         CONSTRAINT "FK_1b3ee67e26c787f4b317bf776ee" FOREIGN KEY (map_product) REFERENCES public.map_product(id)
    //     );`);
    //     await queryRunner.query(`CREATE TABLE "public"."map_product_backup" (
    //         id varchar NOT NULL,
    //         create_date timestamp NOT NULL DEFAULT now(),
    //         "lastUpdatedDate" timestamp NOT NULL DEFAULT now(),
    //         product_id varchar NOT NULL,
    //         product_name varchar NULL,
    //         product_version varchar NULL,
    //         product_type varchar NULL,
    //         product_sub_type varchar NULL,
    //         description varchar NULL,
    //         "imaging_time_begin_UTC" timestamptz NULL,
    //         "imaging_time_end_UTC" timestamptz NULL,
    //         footprint varchar NOT NULL,
    //         transparency varchar NULL,
    //         region varchar NULL,
    //         "ingestionDate" timestamptz NULL,
    //         max_resolution_deg float8 NULL,
    //         is_checked_against_maps timestamptz NULL,
    //         CONSTRAINT "PK_7dcd3fe698bbfefa46e14a4ae9d" PRIMARY KEY (id)
    //     );`);
    //     await queryRunner.query(`INSERT INTO "public"."map_backup" SELECT * FROM "public"."map";`);
    //     await queryRunner.query(`INSERT INTO "public"."map_product_backup" SELECT * FROM "public"."map_product";`);

        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "map_backup" AS SELECT * FROM "map"`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "map_product_backup" AS SELECT * FROM "map_product"`);

        await queryRunner.query(`DROP INDEX "public"."map_id_product_id_unique"`);
        await queryRunner.query(`ALTER TABLE "map_product" ADD "new_id" SERIAL NOT NULL`);

        await queryRunner.query(`ALTER TABLE "map" DROP CONSTRAINT "FK_1b3ee67e26c787f4b317bf776ee"`);
        await queryRunner.query(`ALTER TABLE "map_product" DROP CONSTRAINT "PK_7dcd3fe698bbfefa46e14a4ae9d"`);
        await queryRunner.query(`ALTER TABLE "map_product" ADD CONSTRAINT "PK_7dcd3fe698bbfefa46e14a4ae9d" PRIMARY KEY ("new_id")`);

        await queryRunner.query(`ALTER TABLE "map" ADD "new_map_product" integer`);
        await queryRunner.query(`UPDATE "map" as "m" SET "new_map_product" = (SELECT "mp"."new_id" FROM "map_product" as "mp" WHERE "m"."map_product" = "mp"."id" );`);
        await queryRunner.query(`ALTER TABLE "map" ADD CONSTRAINT "FK_1b3ee67e26c787f4b317bf776ee" FOREIGN KEY ("new_map_product") REFERENCES "map_product"("new_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);

        await queryRunner.query(`CREATE UNIQUE INDEX "id_type_ingestion_date_unique" ON "map_product" USING btree ("id", "product_type", "ingestionDate") `);

        await queryRunner.query(`ALTER TABLE "map_product" RENAME COLUMN "id" TO "p_id"`);
        await queryRunner.query(`ALTER TABLE "map_product" RENAME COLUMN "new_id" TO "id"`);

        await queryRunner.query(`ALTER TABLE "map" DROP COLUMN "map_product"`);
        await queryRunner.query(`ALTER TABLE "map" RENAME COLUMN "new_map_product" TO "map_product"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "id_type_ingestion_date_unique"`);

        await queryRunner.query(`ALTER TABLE "map" ADD "old_map_product" character varying`);
        await queryRunner.query(`UPDATE "map" as "m" SET "old_map_product" = (SELECT "mp"."p_id" FROM "map_product" as "mp" WHERE "m"."map_product" = "mp"."id" );`);

        await queryRunner.query(`ALTER TABLE "map" DROP CONSTRAINT "FK_1b3ee67e26c787f4b317bf776ee"`);

        await queryRunner.query(`ALTER TABLE "map_product" DROP CONSTRAINT "PK_7dcd3fe698bbfefa46e14a4ae9d"`);
        await queryRunner.query(`ALTER TABLE "map_product" ADD CONSTRAINT "PK_7dcd3fe698bbfefa46e14a4ae9d" PRIMARY KEY ("p_id")`);

        await queryRunner.query(`ALTER TABLE "map" ADD CONSTRAINT "FK_1b3ee67e26c787f4b317bf776ee" FOREIGN KEY ("old_map_product") REFERENCES "map_product"("p_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);


        await queryRunner.query(`CREATE UNIQUE INDEX "map_id_product_id_unique" ON "map_product" USING btree ("p_id", "product_id") `);

        await queryRunner.query(`ALTER TABLE "map" DROP COLUMN "map_product"`);
        await queryRunner.query(`ALTER TABLE "map" RENAME COLUMN "old_map_product" TO "map_product"`);

        await queryRunner.query(`ALTER TABLE "map_product" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "map_product" RENAME COLUMN "p_id" TO "id"`);
    }

}
