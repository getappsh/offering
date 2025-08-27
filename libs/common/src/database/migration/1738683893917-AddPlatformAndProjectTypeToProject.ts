import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPlatformAndProjectTypeToProject1738683893917 implements MigrationInterface {
    name = 'AddPlatformAndProjectTypeToProject1738683893917'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "platform" ("name" character varying NOT NULL, CONSTRAINT "PK_b9b57ec16b9c2ac927aa62b8b3f" PRIMARY KEY ("name"))`);
        await queryRunner.query(`CREATE TABLE "artifact_platforms" ("artifact_id" integer NOT NULL, "platform_name" character varying NOT NULL, CONSTRAINT "PK_734ace16da411015e22c7cd6cc0" PRIMARY KEY ("artifact_id", "platform_name"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a932ff092a29a482e0fdec90b3" ON "artifact_platforms" ("artifact_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_7b25e59a707c163f0bb4d0a6f3" ON "artifact_platforms" ("platform_name") `);
        await queryRunner.query(`CREATE TABLE "project_platforms" ("project_id" integer NOT NULL, "platform_name" character varying NOT NULL, CONSTRAINT "PK_77a1b99e4bfc91bd94a40710092" PRIMARY KEY ("project_id", "platform_name"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a606bc2e8039f04412465a409d" ON "project_platforms" ("project_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_e9cfc0929860514179311529de" ON "project_platforms" ("platform_name") `);
        await queryRunner.query(`CREATE TYPE "public"."project_project_type_enum" AS ENUM('product', 'formation')`);
        await queryRunner.query(`ALTER TABLE "project" ADD "project_type" "public"."project_project_type_enum" NOT NULL DEFAULT 'product'`);
        await queryRunner.query(`ALTER TABLE "artifact_platforms" ADD CONSTRAINT "FK_a932ff092a29a482e0fdec90b3a" FOREIGN KEY ("artifact_id") REFERENCES "release_artifact"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "artifact_platforms" ADD CONSTRAINT "FK_7b25e59a707c163f0bb4d0a6f36" FOREIGN KEY ("platform_name") REFERENCES "platform"("name") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "project_platforms" ADD CONSTRAINT "FK_a606bc2e8039f04412465a409d0" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "project_platforms" ADD CONSTRAINT "FK_e9cfc0929860514179311529ded" FOREIGN KEY ("platform_name") REFERENCES "platform"("name") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_platforms" DROP CONSTRAINT "FK_e9cfc0929860514179311529ded"`);
        await queryRunner.query(`ALTER TABLE "project_platforms" DROP CONSTRAINT "FK_a606bc2e8039f04412465a409d0"`);
        await queryRunner.query(`ALTER TABLE "artifact_platforms" DROP CONSTRAINT "FK_7b25e59a707c163f0bb4d0a6f36"`);
        await queryRunner.query(`ALTER TABLE "artifact_platforms" DROP CONSTRAINT "FK_a932ff092a29a482e0fdec90b3a"`);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "project_type"`);
        await queryRunner.query(`DROP TYPE "public"."project_project_type_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e9cfc0929860514179311529de"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a606bc2e8039f04412465a409d"`);
        await queryRunner.query(`DROP TABLE "project_platforms"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7b25e59a707c163f0bb4d0a6f3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a932ff092a29a482e0fdec90b3"`);
        await queryRunner.query(`DROP TABLE "artifact_platforms"`);
        await queryRunner.query(`DROP TABLE "platform"`);
    }

}
