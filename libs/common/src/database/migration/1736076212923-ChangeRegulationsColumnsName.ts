import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeRegulationsColumnsName1736076212923 implements MigrationInterface {
    name = 'ChangeRegulationsColumnsName1736076212923'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "regulation_status" DROP CONSTRAINT "FK_067c1ee45cb4e117213a9b5fb15"`);
        await queryRunner.query(`ALTER TABLE "regulation_status" DROP CONSTRAINT "FK_6fd5ff4e1ea48ce3d11f18e5999"`);
        await queryRunner.query(`ALTER TABLE "regulation_status" RENAME COLUMN "isCompliant" TO "is_compliant"`);
        await queryRunner.query(`ALTER TABLE "regulation_status" RENAME COLUMN "reportDetails" TO "report_details"`);
        await queryRunner.query(`ALTER TABLE "regulation_status" RENAME COLUMN "versionCatalogId" TO "version_id"`);
        await queryRunner.query(`ALTER TABLE "regulation_status" RENAME COLUMN "regulationId" TO "regulation_id"`);
        await queryRunner.query(`ALTER TABLE "regulation_status" ADD CONSTRAINT "FK_1b29a4b9dd8c7cf776b9750db93" FOREIGN KEY ("version_id") REFERENCES "upload_version"("catalog_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "regulation_status" ADD CONSTRAINT "FK_59f8e500f2dd2cb4d2fcd15a5dc" FOREIGN KEY ("regulation_id") REFERENCES "regulation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);

        await queryRunner.query(`ALTER TABLE "regulation" DROP CONSTRAINT "FK_fac2893b24e8cb5ef0cd6d3c41e"`);
        await queryRunner.query(`ALTER TABLE "regulation" DROP CONSTRAINT "FK_51e0e504d80756cc26725892f7c"`);
        await queryRunner.query(`ALTER TABLE "regulation" RENAME COLUMN "typeId" TO "type_id"`);
        await queryRunner.query(`ALTER TABLE "regulation" RENAME COLUMN "projectId" TO "project_id"`);
        await queryRunner.query(`ALTER TABLE "regulation" ADD CONSTRAINT "FK_9eb4d4ce008e8e06edd12b1ee7e" FOREIGN KEY ("type_id") REFERENCES "regulation_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "regulation" ADD CONSTRAINT "FK_da45a7b500cb0aab83fb6bd9134" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "regulation" DROP CONSTRAINT "FK_da45a7b500cb0aab83fb6bd9134"`);
        await queryRunner.query(`ALTER TABLE "regulation" DROP CONSTRAINT "FK_9eb4d4ce008e8e06edd12b1ee7e"`);
        await queryRunner.query(`ALTER TABLE "regulation_status" DROP CONSTRAINT "FK_59f8e500f2dd2cb4d2fcd15a5dc"`);
        await queryRunner.query(`ALTER TABLE "regulation_status" DROP CONSTRAINT "FK_1b29a4b9dd8c7cf776b9750db93"`);

        await queryRunner.query(`ALTER TABLE "regulation_status" RENAME COLUMN "is_compliant" TO "isCompliant"`);
        await queryRunner.query(`ALTER TABLE "regulation_status" RENAME COLUMN "report_details" TO "reportDetails"`);
        await queryRunner.query(`ALTER TABLE "regulation_status" RENAME COLUMN "version_id" TO "versionCatalogId"`);
        await queryRunner.query(`ALTER TABLE "regulation_status" RENAME COLUMN "regulation_id" TO "regulationId"`);
        await queryRunner.query(`ALTER TABLE "regulation" RENAME COLUMN "type_id" TO "typeId"`);
        await queryRunner.query(`ALTER TABLE "regulation" RENAME COLUMN "project_id" TO "projectId"`);


        await queryRunner.query(`ALTER TABLE "regulation" ADD CONSTRAINT "FK_51e0e504d80756cc26725892f7c" FOREIGN KEY ("type_id") REFERENCES "regulation_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "regulation" ADD CONSTRAINT "FK_fac2893b24e8cb5ef0cd6d3c41e" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "regulation_status" ADD CONSTRAINT "FK_6fd5ff4e1ea48ce3d11f18e5999" FOREIGN KEY ("version_id") REFERENCES "upload_version"("catalog_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "regulation_status" ADD CONSTRAINT "FK_067c1ee45cb4e117213a9b5fb15" FOREIGN KEY ("regulation_id") REFERENCES "regulation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
}