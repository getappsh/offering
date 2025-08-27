import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProjectChildrenToDeviceType1749726996044 implements MigrationInterface {
    name = 'AddProjectChildrenToDeviceType1749726996044'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "device_type_project" ("device_type_name" character varying NOT NULL, "project_id" integer NOT NULL, CONSTRAINT "PK_debdbae45bc3e1d86c876cf82c1" PRIMARY KEY ("device_type_name", "project_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_9efd8a4c7cbbd37aa32b4937bc" ON "device_type_project" ("device_type_name") `);
        await queryRunner.query(`CREATE INDEX "IDX_0c4ab58466130b044b9fa593b3" ON "device_type_project" ("project_id") `);
        await queryRunner.query(`ALTER TABLE "device_type_project" ADD CONSTRAINT "FK_9efd8a4c7cbbd37aa32b4937bc4" FOREIGN KEY ("device_type_name") REFERENCES "device_type"("name") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "device_type_project" ADD CONSTRAINT "FK_0c4ab58466130b044b9fa593b34" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "device_type_project" DROP CONSTRAINT "FK_0c4ab58466130b044b9fa593b34"`);
        await queryRunner.query(`ALTER TABLE "device_type_project" DROP CONSTRAINT "FK_9efd8a4c7cbbd37aa32b4937bc4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0c4ab58466130b044b9fa593b3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9efd8a4c7cbbd37aa32b4937bc"`);
        await queryRunner.query(`DROP TABLE "device_type_project"`);
    }

}
