import { MigrationInterface, QueryRunner } from "typeorm"

export class RemovePlatformTable1750086467351 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "device" DROP CONSTRAINT "FK_447e82cd63b48446a2a61246840"`);
        await queryRunner.query(`ALTER TABLE "device" DROP COLUMN "platform_name"`);
        
        await queryRunner.query(`ALTER TABLE "project_platforms" DROP CONSTRAINT "FK_e9cfc0929860514179311529ded"`);
        await queryRunner.query(`ALTER TABLE "project_platforms" DROP CONSTRAINT "FK_a606bc2e8039f04412465a409d0"`);
        await queryRunner.query(`ALTER TABLE "artifact_platforms" DROP CONSTRAINT "FK_7b25e59a707c163f0bb4d0a6f36"`);
        await queryRunner.query(`ALTER TABLE "artifact_platforms" DROP CONSTRAINT "FK_a932ff092a29a482e0fdec90b3a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e9cfc0929860514179311529de"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a606bc2e8039f04412465a409d"`);
        await queryRunner.query(`DROP TABLE "project_platforms"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7b25e59a707c163f0bb4d0a6f3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a932ff092a29a482e0fdec90b3"`);
        await queryRunner.query(`DROP TABLE "artifact_platforms"`);

        await queryRunner.query(`ALTER TABLE "device_platforms" DROP CONSTRAINT "FK_11403407f582b8793c9aa6e2aa3"`);
        await queryRunner.query(`ALTER TABLE "device_platforms" DROP CONSTRAINT "FK_b9de9aff18d92b708833a05f7a6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_11403407f582b8793c9aa6e2aa"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b9de9aff18d92b708833a05f7a"`);
        await queryRunner.query(`DROP TABLE "device_platforms"`);

        await queryRunner.query(`DROP TABLE "platform"`);
        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "platform" ("name" character varying NOT NULL, CONSTRAINT "PK_b9b57ec16b9c2ac927aa62b8b3f" PRIMARY KEY ("name"))`);
        await queryRunner.query(`CREATE TABLE "artifact_platforms" ("artifact_id" integer NOT NULL, "platform_name" character varying NOT NULL, CONSTRAINT "PK_734ace16da411015e22c7cd6cc0" PRIMARY KEY ("artifact_id", "platform_name"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a932ff092a29a482e0fdec90b3" ON "artifact_platforms" ("artifact_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_7b25e59a707c163f0bb4d0a6f3" ON "artifact_platforms" ("platform_name") `);
        await queryRunner.query(`CREATE TABLE "project_platforms" ("project_id" integer NOT NULL, "platform_name" character varying NOT NULL, CONSTRAINT "PK_77a1b99e4bfc91bd94a40710092" PRIMARY KEY ("project_id", "platform_name"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a606bc2e8039f04412465a409d" ON "project_platforms" ("project_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_e9cfc0929860514179311529de" ON "project_platforms" ("platform_name") `);
        await queryRunner.query(`ALTER TABLE "artifact_platforms" ADD CONSTRAINT "FK_a932ff092a29a482e0fdec90b3a" FOREIGN KEY ("artifact_id") REFERENCES "release_artifact"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "artifact_platforms" ADD CONSTRAINT "FK_7b25e59a707c163f0bb4d0a6f36" FOREIGN KEY ("platform_name") REFERENCES "platform"("name") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "project_platforms" ADD CONSTRAINT "FK_a606bc2e8039f04412465a409d0" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "project_platforms" ADD CONSTRAINT "FK_e9cfc0929860514179311529ded" FOREIGN KEY ("platform_name") REFERENCES "platform"("name") ON DELETE CASCADE ON UPDATE CASCADE`);

        await queryRunner.query(`ALTER TABLE "device" ADD "platform_name" character varying`);
        await queryRunner.query(`ALTER TABLE "device" ADD CONSTRAINT "FK_447e82cd63b48446a2a61246840" FOREIGN KEY ("platform_name") REFERENCES "platform"("name") ON DELETE NO ACTION ON UPDATE CASCADE`);

        await queryRunner.query(`CREATE TABLE "device_platforms" ("device_ID" character varying NOT NULL, "platform_name" character varying NOT NULL, CONSTRAINT "PK_1478a0cef96a2dd95812face8ac" PRIMARY KEY ("device_ID", "platform_name"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b9de9aff18d92b708833a05f7a" ON "device_platforms" ("device_ID") `);
        await queryRunner.query(`CREATE INDEX "IDX_11403407f582b8793c9aa6e2aa" ON "device_platforms" ("platform_name") `);
        await queryRunner.query(`ALTER TABLE "device_platforms" ADD CONSTRAINT "FK_b9de9aff18d92b708833a05f7a6" FOREIGN KEY ("device_ID") REFERENCES "device"("ID") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "device_platforms" ADD CONSTRAINT "FK_11403407f582b8793c9aa6e2aa3" FOREIGN KEY ("platform_name") REFERENCES "platform"("name") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
