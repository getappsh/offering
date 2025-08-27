import { MigrationInterface, QueryRunner } from "typeorm"

export class RemoveDeviceTypeTable1750085565110 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "device_type_project" DROP CONSTRAINT "FK_0c4ab58466130b044b9fa593b34"`);
        await queryRunner.query(`ALTER TABLE "device_type_project" DROP CONSTRAINT "FK_9efd8a4c7cbbd37aa32b4937bc4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0c4ab58466130b044b9fa593b3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9efd8a4c7cbbd37aa32b4937bc"`);
        await queryRunner.query(`DROP TABLE "device_type_project"`);
        
        await queryRunner.query(`ALTER TABLE "platform_device_type" DROP CONSTRAINT "FK_303d9010309c8659b24c72561fe"`);
        await queryRunner.query(`ALTER TABLE "platform_device_type" DROP CONSTRAINT "FK_bcb4430f33dd32aea04fd8d642e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_303d9010309c8659b24c72561f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_bcb4430f33dd32aea04fd8d642"`);
        await queryRunner.query(`DROP TABLE "platform_device_type"`);

        await queryRunner.query(`ALTER TABLE "device" DROP CONSTRAINT "FK_f14bf5d831e5b473ad2f2e68ab6"`);
        await queryRunner.query(`ALTER TABLE "device" DROP COLUMN "device_type"`);
        
        await queryRunner.query(`DROP TABLE "device_type"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "device_type" ("name" character varying NOT NULL, "description" text, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "PK_43013b3c02b7fc5612375c2e965" PRIMARY KEY ("name"))`);
        
        await queryRunner.query(`ALTER TABLE "device" ADD "device_type" character varying`);
        await queryRunner.query(`ALTER TABLE "device" ADD CONSTRAINT "FK_f14bf5d831e5b473ad2f2e68ab6" FOREIGN KEY ("device_type") REFERENCES "device_type"("name") ON DELETE NO ACTION ON UPDATE CASCADE`);
        
        await queryRunner.query(`CREATE TABLE "platform_device_type" ("platform_name" character varying NOT NULL, "device_type_name" character varying NOT NULL, CONSTRAINT "PK_9a3fb391ab0709fa1527c5712fb" PRIMARY KEY ("platform_name", "device_type_name"))`);
        await queryRunner.query(`CREATE INDEX "IDX_bcb4430f33dd32aea04fd8d642" ON "platform_device_type" ("platform_name") `);
        await queryRunner.query(`CREATE INDEX "IDX_303d9010309c8659b24c72561f" ON "platform_device_type" ("device_type_name") `);
        await queryRunner.query(`ALTER TABLE "platform_device_type" ADD CONSTRAINT "FK_bcb4430f33dd32aea04fd8d642e" FOREIGN KEY ("platform_name") REFERENCES "platform"("name") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "platform_device_type" ADD CONSTRAINT "FK_303d9010309c8659b24c72561fe" FOREIGN KEY ("device_type_name") REFERENCES "device_type"("name") ON DELETE NO ACTION ON UPDATE NO ACTION`);

        await queryRunner.query(`CREATE TABLE "device_type_project" ("device_type_name" character varying NOT NULL, "project_id" integer NOT NULL, CONSTRAINT "PK_debdbae45bc3e1d86c876cf82c1" PRIMARY KEY ("device_type_name", "project_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_9efd8a4c7cbbd37aa32b4937bc" ON "device_type_project" ("device_type_name") `);
        await queryRunner.query(`CREATE INDEX "IDX_0c4ab58466130b044b9fa593b3" ON "device_type_project" ("project_id") `);
        await queryRunner.query(`ALTER TABLE "device_type_project" ADD CONSTRAINT "FK_9efd8a4c7cbbd37aa32b4937bc4" FOREIGN KEY ("device_type_name") REFERENCES "device_type"("name") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "device_type_project" ADD CONSTRAINT "FK_0c4ab58466130b044b9fa593b34" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);

    }

}
