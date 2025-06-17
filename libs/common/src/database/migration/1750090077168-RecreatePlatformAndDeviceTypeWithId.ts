import { MigrationInterface, QueryRunner } from "typeorm";

export class RecreatePlatformAndDeviceTypeWithId1750090077168 implements MigrationInterface {
    name = 'RecreatePlatformAndDeviceTypeWithId1750090077168'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "device_type" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" text, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "UQ_43013b3c02b7fc5612375c2e965" UNIQUE ("name"), CONSTRAINT "PK_f8d1c0daa8abde339c1056535a0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "platform" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying, "os" "public"."platform_os_enum", "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "UQ_b9b57ec16b9c2ac927aa62b8b3f" UNIQUE ("name"), CONSTRAINT "PK_c33d6abeebd214bd2850bfd6b8e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "device_type_project" ("device_type_id" integer NOT NULL, "project_id" integer NOT NULL, CONSTRAINT "PK_3c2ff12173e3df9627e699c721e" PRIMARY KEY ("device_type_id", "project_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_459a69eb47cc1ab5f664822af0" ON "device_type_project" ("device_type_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_0c4ab58466130b044b9fa593b3" ON "device_type_project" ("project_id") `);
        await queryRunner.query(`CREATE TABLE "platform_device_type" ("platform_id" integer NOT NULL, "device_type_id" integer NOT NULL, CONSTRAINT "PK_b591ee664fdd06cc19a130e119c" PRIMARY KEY ("platform_id", "device_type_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_54cf8d0f71f944b36489a5242c" ON "platform_device_type" ("platform_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_86a2e27320d8434d971ea976a5" ON "platform_device_type" ("device_type_id") `);
        await queryRunner.query(`ALTER TABLE "device" ADD "platform_id" integer`);
        await queryRunner.query(`ALTER TABLE "device" ADD "device_type_id" integer`);
        await queryRunner.query(`ALTER TABLE "device" ADD CONSTRAINT "FK_a4431527b507da2834b9cd02fc9" FOREIGN KEY ("platform_id") REFERENCES "platform"("id") ON DELETE NO ACTION ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "device" ADD CONSTRAINT "FK_9aa8fcca6a2f86b2638c02fd1bd" FOREIGN KEY ("device_type_id") REFERENCES "device_type"("id") ON DELETE NO ACTION ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "device_type_project" ADD CONSTRAINT "FK_459a69eb47cc1ab5f664822af0e" FOREIGN KEY ("device_type_id") REFERENCES "device_type"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "device_type_project" ADD CONSTRAINT "FK_0c4ab58466130b044b9fa593b34" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "platform_device_type" ADD CONSTRAINT "FK_54cf8d0f71f944b36489a5242c5" FOREIGN KEY ("platform_id") REFERENCES "platform"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "platform_device_type" ADD CONSTRAINT "FK_86a2e27320d8434d971ea976a5e" FOREIGN KEY ("device_type_id") REFERENCES "device_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);

        await queryRunner.query(`CREATE TABLE "project_platforms" ("project_id" integer NOT NULL, "platform_name" character varying NOT NULL, CONSTRAINT "PK_77a1b99e4bfc91bd94a40710092" PRIMARY KEY ("project_id", "platform_name"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a606bc2e8039f04412465a409d" ON "project_platforms" ("project_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_e9cfc0929860514179311529de" ON "project_platforms" ("platform_name") `);
        await queryRunner.query(`ALTER TABLE "project_platforms" ADD CONSTRAINT "FK_a606bc2e8039f04412465a409d0" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "project_platforms" ADD CONSTRAINT "FK_e9cfc0929860514179311529ded" FOREIGN KEY ("platform_name") REFERENCES "platform"("name") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_platforms" DROP CONSTRAINT "FK_e9cfc0929860514179311529ded"`);
        await queryRunner.query(`ALTER TABLE "project_platforms" DROP CONSTRAINT "FK_a606bc2e8039f04412465a409d0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e9cfc0929860514179311529de"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a606bc2e8039f04412465a409d"`);
        await queryRunner.query(`DROP TABLE "project_platforms"`);

        await queryRunner.query(`ALTER TABLE "platform_device_type" DROP CONSTRAINT "FK_86a2e27320d8434d971ea976a5e"`);
        await queryRunner.query(`ALTER TABLE "platform_device_type" DROP CONSTRAINT "FK_54cf8d0f71f944b36489a5242c5"`);
        await queryRunner.query(`ALTER TABLE "device_type_project" DROP CONSTRAINT "FK_0c4ab58466130b044b9fa593b34"`);
        await queryRunner.query(`ALTER TABLE "device_type_project" DROP CONSTRAINT "FK_459a69eb47cc1ab5f664822af0e"`);
        await queryRunner.query(`ALTER TABLE "device" DROP CONSTRAINT "FK_9aa8fcca6a2f86b2638c02fd1bd"`);
        await queryRunner.query(`ALTER TABLE "device" DROP CONSTRAINT "FK_a4431527b507da2834b9cd02fc9"`);
        await queryRunner.query(`ALTER TABLE "device" DROP COLUMN "device_type_id"`);
        await queryRunner.query(`ALTER TABLE "device" DROP COLUMN "platform_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_86a2e27320d8434d971ea976a5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_54cf8d0f71f944b36489a5242c"`);
        await queryRunner.query(`DROP TABLE "platform_device_type"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0c4ab58466130b044b9fa593b3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_459a69eb47cc1ab5f664822af0"`);
        await queryRunner.query(`DROP TABLE "device_type_project"`);
        await queryRunner.query(`DROP TABLE "platform"`);
        await queryRunner.query(`DROP TABLE "device_type"`);
    }

}
