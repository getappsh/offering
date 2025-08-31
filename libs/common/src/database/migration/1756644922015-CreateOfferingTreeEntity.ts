import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateOfferingTreeEntity1756644922015 implements MigrationInterface {
    name = 'CreateOfferingTreeEntity1756644922015'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "offering_tree_policy" ("id" SERIAL NOT NULL, "createdDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "lastUpdatedDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "platform_id" integer, "device_type_id" integer, "project_id" integer NOT NULL, "catalog_id" character varying NOT NULL, CONSTRAINT "PK_4df10454f97a81171d7e47c6093" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_08b61b07472247dc03568280b8" ON "offering_tree_policy" (COALESCE("platform_id", -1), COALESCE("device_type_id", -1), "project_id") `);
        await queryRunner.query(`ALTER TABLE "offering_tree_policy" ADD CONSTRAINT "FK_64361bc1fa9d5a776432e05d184" FOREIGN KEY ("platform_id") REFERENCES "platform"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "offering_tree_policy" ADD CONSTRAINT "FK_7affc26f7561a1329f6da0c9ec1" FOREIGN KEY ("device_type_id") REFERENCES "device_type"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "offering_tree_policy" ADD CONSTRAINT "FK_424786eea34c5f5c9d942cf8042" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "offering_tree_policy" ADD CONSTRAINT "FK_c32cb01b5fd015f903a54128dfa" FOREIGN KEY ("catalog_id") REFERENCES "release"("catalog_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "offering_tree_policy" DROP CONSTRAINT "FK_c32cb01b5fd015f903a54128dfa"`);
        await queryRunner.query(`ALTER TABLE "offering_tree_policy" DROP CONSTRAINT "FK_424786eea34c5f5c9d942cf8042"`);
        await queryRunner.query(`ALTER TABLE "offering_tree_policy" DROP CONSTRAINT "FK_7affc26f7561a1329f6da0c9ec1"`);
        await queryRunner.query(`ALTER TABLE "offering_tree_policy" DROP CONSTRAINT "FK_64361bc1fa9d5a776432e05d184"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_08b61b07472247dc03568280b8"`);
        await queryRunner.query(`DROP TABLE "offering_tree_policy"`);
    }

}
