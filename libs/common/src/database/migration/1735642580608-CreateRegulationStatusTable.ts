import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRegulationStatusTable1735642580608 implements MigrationInterface {
    name = 'CreateRegulationStatusTable1735642580608'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "regulation" DROP CONSTRAINT "FK_b371a78fa40b0d07215e81a296e"`);
        await queryRunner.query(`ALTER TABLE "regulation" DROP CONSTRAINT "FK_328792ae21e8a7496bacc2e6bc0"`);
        await queryRunner.query(`CREATE TABLE "regulation_status" ("id" SERIAL NOT NULL, "isCompliant" boolean NOT NULL DEFAULT false, "value" character varying, "reportDetails" character varying, "versionCatalogId" character varying, "regulationId" integer, CONSTRAINT "regulation_version_unique_constraint" UNIQUE ("regulationId", "versionCatalogId"), CONSTRAINT "PK_07628c8c3d52e232d1b0d660a54" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "regulation_status" ADD CONSTRAINT "FK_6fd5ff4e1ea48ce3d11f18e5999" FOREIGN KEY ("versionCatalogId") REFERENCES "upload_version"("catalog_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "regulation_status" ADD CONSTRAINT "FK_067c1ee45cb4e117213a9b5fb15" FOREIGN KEY ("regulationId") REFERENCES "regulation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "regulation" ADD CONSTRAINT "FK_51e0e504d80756cc26725892f7c" FOREIGN KEY ("typeId") REFERENCES "regulation_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "regulation" ADD CONSTRAINT "FK_fac2893b24e8cb5ef0cd6d3c41e" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "regulation" DROP CONSTRAINT "FK_fac2893b24e8cb5ef0cd6d3c41e"`);
        await queryRunner.query(`ALTER TABLE "regulation" DROP CONSTRAINT "FK_51e0e504d80756cc26725892f7c"`);
        await queryRunner.query(`ALTER TABLE "regulation_status" DROP CONSTRAINT "FK_067c1ee45cb4e117213a9b5fb15"`);
        await queryRunner.query(`ALTER TABLE "regulation_status" DROP CONSTRAINT "FK_6fd5ff4e1ea48ce3d11f18e5999"`);
        await queryRunner.query(`DROP TABLE "regulation_status"`);
        await queryRunner.query(`ALTER TABLE "regulation" ADD CONSTRAINT "FK_328792ae21e8a7496bacc2e6bc0" FOREIGN KEY ("typeId") REFERENCES "regulation_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "regulation" ADD CONSTRAINT "FK_b371a78fa40b0d07215e81a296e" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
