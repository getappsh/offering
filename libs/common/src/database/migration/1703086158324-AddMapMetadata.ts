import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMapMetadata1703086158324 implements MigrationInterface {
    name = 'AddMapMetadata1703086158324'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "map" DROP COLUMN "product_id"`);
        await queryRunner.query(`ALTER TABLE "map" DROP COLUMN "product_name"`);
        await queryRunner.query(`ALTER TABLE "map" ADD "progress" integer`);
        await queryRunner.query(`ALTER TABLE "map" ADD "export_start" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "map" ADD "export_end" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "map" ADD "job_id" character varying`);
        await queryRunner.query(`ALTER TABLE "map" ADD "map_product" character varying`);
        await queryRunner.query(`ALTER TABLE "map" ADD CONSTRAINT "FK_1b3ee67e26c787f4b317bf776ee" FOREIGN KEY ("map_product") REFERENCES "map_product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "map" DROP CONSTRAINT "FK_1b3ee67e26c787f4b317bf776ee"`);
        await queryRunner.query(`ALTER TABLE "map" DROP COLUMN "map_product"`);
        await queryRunner.query(`ALTER TABLE "map" DROP COLUMN "job_id"`);
        await queryRunner.query(`ALTER TABLE "map" DROP COLUMN "export_end"`);
        await queryRunner.query(`ALTER TABLE "map" DROP COLUMN "export_start"`);
        await queryRunner.query(`ALTER TABLE "map" DROP COLUMN "progress"`);
        await queryRunner.query(`ALTER TABLE "map" ADD "product_name" character varying`);
        await queryRunner.query(`ALTER TABLE "map" ADD "product_id" character varying`);
    }

}
