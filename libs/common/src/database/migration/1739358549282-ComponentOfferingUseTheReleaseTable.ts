import { MigrationInterface, QueryRunner } from "typeorm"

export class ComponentOfferingUseTheReleaseTable1739358549282 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "component_offering"`);
        await queryRunner.query(`ALTER TABLE "component_offering" DROP CONSTRAINT "FK_0354d08076030bc065acd0c2c00"`);
        await queryRunner.query(`ALTER TABLE "component_offering" DROP CONSTRAINT "component_offering_unique_constraint"`);
        await queryRunner.query(`ALTER TABLE "component_offering" DROP COLUMN "component_catalog_id"`);
        
        await queryRunner.query(`ALTER TABLE "component_offering" DROP CONSTRAINT "FK_069f79bc44a1ab451879e9b4e6c"`);
        await queryRunner.query(`ALTER TABLE "component_offering" ADD "release_catalog_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "component_offering" ADD CONSTRAINT "device_release_offering_unique_constraint" UNIQUE ("device_ID", "release_catalog_id")`);
        await queryRunner.query(`ALTER TABLE "component_offering" ADD CONSTRAINT "FK_069f79bc44a1ab451879e9b4e6c" FOREIGN KEY ("device_ID") REFERENCES "device"("ID") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "component_offering" ADD CONSTRAINT "FK_a2ed89dee6f5cb721ea03663973" FOREIGN KEY ("release_catalog_id") REFERENCES "release"("catalog_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "component_offering" DROP CONSTRAINT "FK_a2ed89dee6f5cb721ea03663973"`);
        await queryRunner.query(`ALTER TABLE "component_offering" DROP CONSTRAINT "FK_069f79bc44a1ab451879e9b4e6c"`);
        await queryRunner.query(`ALTER TABLE "component_offering" DROP CONSTRAINT "device_release_offering_unique_constraint"`);
        await queryRunner.query(`ALTER TABLE "component_offering" DROP COLUMN "release_catalog_id"`);
        await queryRunner.query(`ALTER TABLE "component_offering" ADD CONSTRAINT "FK_069f79bc44a1ab451879e9b4e6c" FOREIGN KEY ("device_ID") REFERENCES "device"("ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);

        await queryRunner.query(`ALTER TABLE "component_offering" ADD "component_catalog_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "component_offering" ADD CONSTRAINT "component_offering_unique_constraint" UNIQUE ("device_ID", "component_catalog_id")`);
        await queryRunner.query(`ALTER TABLE "component_offering" ADD CONSTRAINT "FK_0354d08076030bc065acd0c2c00" FOREIGN KEY ("component_catalog_id") REFERENCES "upload_version"("catalog_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
