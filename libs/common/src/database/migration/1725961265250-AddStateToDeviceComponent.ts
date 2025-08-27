import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStateToDeviceComponent1725961265250 implements MigrationInterface {
    name = 'AddStateToDeviceComponent1725961265250'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "device_component" DROP CONSTRAINT "FK_1f163ac3d48a67c9bf6a3d247f1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8a6cec72480ff6c70a65125166"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1f163ac3d48a67c9bf6a3d247f"`);
        await queryRunner.query(`ALTER TABLE "device_component" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "device_component" DROP CONSTRAINT "PK_5536e424deb25c711f50fe37ff8"`);
        await queryRunner.query(`ALTER TABLE "device_component" ADD CONSTRAINT "PK_c492094283f95c061e050ee9458" PRIMARY KEY ("device_ID", "component_catalog_id", "id")`);
        await queryRunner.query(`ALTER TABLE "device_component" ADD "createdDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "device_component" ADD "lastUpdatedDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`CREATE TYPE "public"."device_component_state_enum" AS ENUM('offering', 'push', 'delivery', 'deploy', 'installed', 'uninstalled')`);
        await queryRunner.query(`ALTER TABLE "device_component" ADD "state" "public"."device_component_state_enum" NOT NULL DEFAULT 'delivery'`);
        await queryRunner.query(`ALTER TABLE "device_component" DROP CONSTRAINT "FK_8a6cec72480ff6c70a651251660"`);
        await queryRunner.query(`ALTER TABLE "device_component" DROP CONSTRAINT "PK_c492094283f95c061e050ee9458"`);
        await queryRunner.query(`ALTER TABLE "device_component" ADD CONSTRAINT "PK_c0103022695f261c2a661c3d905" PRIMARY KEY ("component_catalog_id", "id")`);
        await queryRunner.query(`ALTER TABLE "device_component" DROP CONSTRAINT "PK_c0103022695f261c2a661c3d905"`);
        await queryRunner.query(`ALTER TABLE "device_component" ADD CONSTRAINT "PK_bc2daf7ce9b89db678b651bbf97" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "device_component" ADD CONSTRAINT "device_component_unique_constraint" UNIQUE ("device_ID", "component_catalog_id")`);
        await queryRunner.query(`ALTER TABLE "device_component" ADD CONSTRAINT "FK_1f163ac3d48a67c9bf6a3d247f1" FOREIGN KEY ("device_ID") REFERENCES "device"("ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "device_component" ADD CONSTRAINT "FK_8a6cec72480ff6c70a651251660" FOREIGN KEY ("component_catalog_id") REFERENCES "upload_version"("catalog_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "device_component" DROP CONSTRAINT "FK_8a6cec72480ff6c70a651251660"`);
        await queryRunner.query(`ALTER TABLE "device_component" DROP CONSTRAINT "FK_1f163ac3d48a67c9bf6a3d247f1"`);
        await queryRunner.query(`ALTER TABLE "device_component" DROP CONSTRAINT "device_component_unique_constraint"`);
        await queryRunner.query(`ALTER TABLE "device_component" DROP CONSTRAINT "PK_bc2daf7ce9b89db678b651bbf97"`);
        await queryRunner.query(`ALTER TABLE "device_component" ADD CONSTRAINT "PK_c0103022695f261c2a661c3d905" PRIMARY KEY ("component_catalog_id", "id")`);
        await queryRunner.query(`ALTER TABLE "device_component" DROP CONSTRAINT "PK_c0103022695f261c2a661c3d905"`);
        await queryRunner.query(`ALTER TABLE "device_component" ADD CONSTRAINT "PK_c492094283f95c061e050ee9458" PRIMARY KEY ("device_ID", "component_catalog_id", "id")`);
        await queryRunner.query(`ALTER TABLE "device_component" ADD CONSTRAINT "FK_8a6cec72480ff6c70a651251660" FOREIGN KEY ("component_catalog_id") REFERENCES "upload_version"("catalog_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "device_component" DROP COLUMN "state"`);
        await queryRunner.query(`DROP TYPE "public"."device_component_state_enum"`);
        await queryRunner.query(`ALTER TABLE "device_component" DROP COLUMN "lastUpdatedDate"`);
        await queryRunner.query(`ALTER TABLE "device_component" DROP COLUMN "createdDate"`);
        await queryRunner.query(`ALTER TABLE "device_component" DROP CONSTRAINT "PK_c492094283f95c061e050ee9458"`);
        await queryRunner.query(`ALTER TABLE "device_component" ADD CONSTRAINT "PK_5536e424deb25c711f50fe37ff8" PRIMARY KEY ("device_ID", "component_catalog_id")`);
        await queryRunner.query(`ALTER TABLE "device_component" DROP COLUMN "id"`);
        await queryRunner.query(`CREATE INDEX "IDX_1f163ac3d48a67c9bf6a3d247f" ON "device_component" ("device_ID") `);
        await queryRunner.query(`CREATE INDEX "IDX_8a6cec72480ff6c70a65125166" ON "device_component" ("component_catalog_id") `);
        await queryRunner.query(`ALTER TABLE "device_component" ADD CONSTRAINT "FK_1f163ac3d48a67c9bf6a3d247f1" FOREIGN KEY ("device_ID") REFERENCES "device"("ID") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
