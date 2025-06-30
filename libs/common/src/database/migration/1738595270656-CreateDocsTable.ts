import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDocsTable1738595270656 implements MigrationInterface {
    name = 'CreateDocsTable1738595270656'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "docs" ("id" SERIAL NOT NULL, "createdDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "lastUpdatedDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, "is_url" boolean NOT NULL DEFAULT false, "readme" text, "doc_url" character varying, "project_id" integer NOT NULL, CONSTRAINT "PK_3a13e0daf5db0055b25d829f2f2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "docs" ADD CONSTRAINT "FK_1fab7713bc5c8d87d1eff2c87c8" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "docs" DROP CONSTRAINT "FK_1fab7713bc5c8d87d1eff2c87c8"`);
        await queryRunner.query(`DROP TABLE "docs"`);
    }

}
