import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMoreStatusesToMapAndUpdateByCol1758470190475 implements MigrationInterface {
    name = 'AddMoreStatusesToMapAndUpdateByCol1758470190475'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "map" ADD "update_by" character varying`);
        await queryRunner.query(`ALTER TYPE "public"."map_status_enum" RENAME TO "map_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."map_status_enum" AS ENUM('Draft', 'Pending', 'Start', 'InProgress', 'Pause', 'Cancel', 'Error', 'Done', 'Discovered', 'Expired', 'Archived')`);
        await queryRunner.query(`ALTER TABLE "map" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "map" ALTER COLUMN "status" TYPE "public"."map_status_enum" USING "status"::"text"::"public"."map_status_enum"`);
        await queryRunner.query(`ALTER TABLE "map" ALTER COLUMN "status" SET DEFAULT 'Start'`);
        await queryRunner.query(`DROP TYPE "public"."map_status_enum_old" CASCADE`);
        await queryRunner.query(`ALTER TABLE "map" ADD CONSTRAINT "FK_3a052a8181992e7f7711ded5731" FOREIGN KEY ("update_by") REFERENCES "map"("catalog_id") ON DELETE SET NULL ON UPDATE NO ACTION`);

        await queryRunner.query(`DROP TABLE IF EXISTS "map_backup"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "map_product_backup"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "map" DROP CONSTRAINT "FK_3a052a8181992e7f7711ded5731"`);
        await queryRunner.query(`CREATE TYPE "public"."map_status_enum_old" AS ENUM('Archived', 'Cancel', 'Done', 'Error', 'Expired', 'InProgress', 'Pause', 'Pending', 'Start')`);
        await queryRunner.query(`ALTER TABLE "map" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "map" ALTER COLUMN "status" TYPE "public"."map_status_enum_old" USING "status"::"text"::"public"."map_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "map" ALTER COLUMN "status" SET DEFAULT 'Start'`);
        await queryRunner.query(`DROP TYPE "public"."map_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."map_status_enum_old" RENAME TO "map_status_enum"`);
        await queryRunner.query(`ALTER TABLE "map" DROP COLUMN "update_by"`);
    }

}
