import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCatalogIdColToProduct1747659718616 implements MigrationInterface {
    name = 'AddCatalogIdColToProduct1747659718616'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "map_product" ADD "catalog_id" character varying`);
        await queryRunner.query(`UPDATE "map_product" SET "catalog_id" = id WHERE "catalog_id" IS NULL`);
        await queryRunner.query(`ALTER TABLE "map_product" ALTER COLUMN "catalog_id" SET NOT NULL`);

        await queryRunner.query(`ALTER TABLE "map_product" ALTER COLUMN "product_version" TYPE integer USING "product_version"::integer`);
        await queryRunner.query(`ALTER TABLE "map_product" ALTER COLUMN "product_sub_type" TYPE integer USING "product_sub_type"::integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "map_product" ALTER COLUMN "product_sub_type" TYPE character varying`);
        await queryRunner.query(`ALTER TABLE "map_product" ALTER COLUMN "product_version" TYPE character varying`);
        
        await queryRunner.query(`ALTER TABLE "map_product" DROP COLUMN "catalog_id"`);
    }
}

