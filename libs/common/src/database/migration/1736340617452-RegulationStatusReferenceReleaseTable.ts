import { MigrationInterface, QueryRunner } from "typeorm";

export class RegulationStatusReferenceReleaseTable1736340617452 implements MigrationInterface {
    name = 'RegulationStatusReferenceReleaseTable1736340617452'

    // WARNING: NO HANDING WHEN REGULATION STATUS TABLE HAVE DATA
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "regulation_status" DROP CONSTRAINT "FK_1b29a4b9dd8c7cf776b9750db93"`);
        await queryRunner.query(`ALTER TABLE "regulation_status" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "regulation_status" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "regulation" ADD "display_name" character varying`);
        await queryRunner.query(`ALTER TABLE "regulation_status" DROP CONSTRAINT "FK_59f8e500f2dd2cb4d2fcd15a5dc"`);
        await queryRunner.query(`ALTER TABLE "regulation_status" ALTER COLUMN "version_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "regulation_status" ALTER COLUMN "regulation_id" SET NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_6f45e44f9f3cfaa42b4f7f652b" ON "regulation" ("project_id", "name") `);
        await queryRunner.query(`ALTER TABLE "regulation_status" DROP CONSTRAINT "regulation_version_unique_constraint"`);
        await queryRunner.query(`ALTER TABLE "regulation_status" ADD CONSTRAINT "regulation_version_unique_constraint" UNIQUE ("regulation_id", "version_id")`);
        await queryRunner.query(`ALTER TABLE "regulation_status" ADD CONSTRAINT "FK_1b29a4b9dd8c7cf776b9750db93" FOREIGN KEY ("version_id") REFERENCES "release"("catalog_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "regulation_status" ADD CONSTRAINT "FK_59f8e500f2dd2cb4d2fcd15a5dc" FOREIGN KEY ("regulation_id") REFERENCES "regulation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "regulation_status" DROP CONSTRAINT "FK_59f8e500f2dd2cb4d2fcd15a5dc"`);
        await queryRunner.query(`ALTER TABLE "regulation_status" DROP CONSTRAINT "FK_1b29a4b9dd8c7cf776b9750db93"`);
        await queryRunner.query(`ALTER TABLE "regulation_status" DROP CONSTRAINT "regulation_version_unique_constraint"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6f45e44f9f3cfaa42b4f7f652b"`);
        await queryRunner.query(`ALTER TABLE "regulation_status" ALTER COLUMN "regulation_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "regulation_status" ALTER COLUMN "version_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "regulation_status" ADD CONSTRAINT "FK_59f8e500f2dd2cb4d2fcd15a5dc" FOREIGN KEY ("regulation_id") REFERENCES "regulation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "regulation" DROP COLUMN "display_name"`);
        await queryRunner.query(`ALTER TABLE "regulation_status" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "regulation_status" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "regulation_status" ADD CONSTRAINT "FK_1b29a4b9dd8c7cf776b9750db93" FOREIGN KEY ("version_id") REFERENCES "upload_version"("catalog_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
