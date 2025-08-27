import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRegulationForProject1734958494007 implements MigrationInterface {
    name = 'CreateRegulationForProject1734958494007'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "regulation_type" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying, CONSTRAINT "PK_6d4583e8b98e5146266edd44ad9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "regulation" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying, "config" character varying, "order" integer NOT NULL DEFAULT '0', "typeId" integer, "projectId" integer, CONSTRAINT "PK_c8f5c3b6de47e24f45a3e6ab316" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "regulation" ADD CONSTRAINT "FK_328792ae21e8a7496bacc2e6bc0" FOREIGN KEY ("typeId") REFERENCES "regulation_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "regulation" ADD CONSTRAINT "FK_b371a78fa40b0d07215e81a296e" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "regulation" DROP CONSTRAINT "FK_b371a78fa40b0d07215e81a296e"`);
        await queryRunner.query(`ALTER TABLE "regulation" DROP CONSTRAINT "FK_328792ae21e8a7496bacc2e6bc0"`);
        await queryRunner.query(`DROP TABLE "regulation"`);
        await queryRunner.query(`DROP TABLE "regulation_type"`);
    }

}
