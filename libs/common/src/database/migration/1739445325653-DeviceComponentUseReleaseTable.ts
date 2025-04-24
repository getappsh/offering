import { MigrationInterface, QueryRunner } from "typeorm";

export class DeviceComponentUseReleaseTable1739445325653 implements MigrationInterface {
    name = 'DeviceComponentUseReleaseTable1739445325653'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "device_component" DROP CONSTRAINT "FK_8a6cec72480ff6c70a651251660"`);
        await queryRunner.query(`ALTER TABLE "device_component" DROP CONSTRAINT "device_component_unique_constraint"`);
        await queryRunner.query(`ALTER TABLE "device_component" DROP COLUMN "component_catalog_id"`);

        await queryRunner.query(`DELETE FROM "device_component"`);

        await queryRunner.query(`ALTER TABLE "device_component" ADD "release_catalog_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "device_component" ADD CONSTRAINT "device_component_unique_constraint" UNIQUE ("device_ID", "release_catalog_id")`);
        await queryRunner.query(`ALTER TABLE "device_component" ADD CONSTRAINT "FK_3bcc20114f5c712d46467eeab2e" FOREIGN KEY ("release_catalog_id") REFERENCES "release"("catalog_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);

        await queryRunner.query(`ALTER TABLE "device_component" ADD "error" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "device_component" DROP COLUMN "error"`);

        await queryRunner.query(`ALTER TABLE "device_component" DROP CONSTRAINT "FK_3bcc20114f5c712d46467eeab2e"`);
        await queryRunner.query(`ALTER TABLE "device_component" DROP CONSTRAINT "device_component_unique_constraint"`);
        await queryRunner.query(`ALTER TABLE "device_component" DROP COLUMN "release_catalog_id"`);

        await queryRunner.query(`ALTER TABLE "device_component" ADD "component_catalog_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "device_component" ADD CONSTRAINT "device_component_unique_constraint" UNIQUE ("device_ID", "component_catalog_id")`);
        await queryRunner.query(`ALTER TABLE "device_component" ADD CONSTRAINT "FK_8a6cec72480ff6c70a651251660" FOREIGN KEY ("component_catalog_id") REFERENCES "upload_version"("catalog_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
