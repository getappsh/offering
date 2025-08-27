import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProjectLabelTable1756209305801 implements MigrationInterface {
    name = 'CreateProjectLabelTable1756209305801'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "labels" ("id" SERIAL NOT NULL, "createdDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "lastUpdatedDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying(255) NOT NULL, CONSTRAINT "UQ_543605929e5ebe08eeeab493f60" UNIQUE ("name"), CONSTRAINT "PK_c0c4e97f76f1f3a268c7a70b925" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "project" ADD "label_id" integer`);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "FK_532dca1d307e1f244082d3cc56f" FOREIGN KEY ("label_id") REFERENCES "labels"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_532dca1d307e1f244082d3cc56f"`);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "label_id"`);
        await queryRunner.query(`DROP TABLE "labels"`);
    }

}
