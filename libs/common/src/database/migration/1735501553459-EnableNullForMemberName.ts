import { MigrationInterface, QueryRunner } from "typeorm";

export class EnableNullForMemberName1735501553459 implements MigrationInterface {
    name = 'EnableNullForMemberName1735501553459'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // await queryRunner.query(`ALTER TABLE "regulation" DROP CONSTRAINT "FK_b371a78fa40b0d07215e81a296e"`);
        // await queryRunner.query(`ALTER TABLE "regulation" DROP CONSTRAINT "FK_328792ae21e8a7496bacc2e6bc0"`);
        await queryRunner.query(`ALTER TABLE "member" ALTER COLUMN "first_name" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "member" ALTER COLUMN "last_name" DROP NOT NULL`);
        // await queryRunner.query(`ALTER TABLE "map_product" DROP COLUMN "product_version"`);
        // await queryRunner.query(`ALTER TABLE "map_product" ADD "product_version" integer`);
        // await queryRunner.query(`ALTER TABLE "map_product" DROP COLUMN "product_sub_type"`);
        // await queryRunner.query(`ALTER TABLE "map_product" ADD "product_sub_type" integer`);
        // await queryRunner.query(`ALTER TABLE "device_config" ALTER COLUMN "data" SET DEFAULT '{}'::json`);
        // await queryRunner.query(`ALTER TABLE "regulation" ADD CONSTRAINT "FK_51e0e504d80756cc26725892f7c" FOREIGN KEY ("typeId") REFERENCES "regulation_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        // await queryRunner.query(`ALTER TABLE "regulation" ADD CONSTRAINT "FK_fac2893b24e8cb5ef0cd6d3c41e" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // await queryRunner.query(`ALTER TABLE "regulation" DROP CONSTRAINT "FK_fac2893b24e8cb5ef0cd6d3c41e"`);
        // await queryRunner.query(`ALTER TABLE "regulation" DROP CONSTRAINT "FK_51e0e504d80756cc26725892f7c"`);
        // await queryRunner.query(`ALTER TABLE "device_config" ALTER COLUMN "data" SET DEFAULT '{}'`);
        // await queryRunner.query(`ALTER TABLE "map_product" DROP COLUMN "product_sub_type"`);
        // await queryRunner.query(`ALTER TABLE "map_product" ADD "product_sub_type" character varying`);
        // await queryRunner.query(`ALTER TABLE "map_product" DROP COLUMN "product_version"`);
        // await queryRunner.query(`ALTER TABLE "map_product" ADD "product_version" character varying`);
        await queryRunner.query(`ALTER TABLE "member" ALTER COLUMN "last_name" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "member" ALTER COLUMN "first_name" SET NOT NULL`);
        // await queryRunner.query(`ALTER TABLE "regulation" ADD CONSTRAINT "FK_328792ae21e8a7496bacc2e6bc0" FOREIGN KEY ("typeId") REFERENCES "regulation_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        // await queryRunner.query(`ALTER TABLE "regulation" ADD CONSTRAINT "FK_b371a78fa40b0d07215e81a296e" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
