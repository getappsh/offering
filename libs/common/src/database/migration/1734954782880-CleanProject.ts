import { MigrationInterface, QueryRunner } from "typeorm";

export class CleanProject1734954782880 implements MigrationInterface {
    name = 'CleanProject1734954782880'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_b2d8a6998de33c634d2e4fba985"`);
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_153cb871996883304a853d02e8f"`);
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_883c751dd4821d23ca68fc3ab6d"`);
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_6991d43331367fb73a9b05b3af0"`);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "artifact_type"`);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "OS"`);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "platform_type"`);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "formation"`);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "category"`);

        await queryRunner.query(`DROP INDEX "public"."project_component_name_unique_constraint"`);

        // Rename the column instead of dropping it
        await queryRunner.query(`ALTER TABLE "project" RENAME COLUMN "component_name" TO "name"`);
        
        await queryRunner.query(`CREATE UNIQUE INDEX "project_name_unique_constraint" ON "project" ("name")`);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."project_name_unique_constraint"`);
        
        // Rename the column back to component_name
        await queryRunner.query(`ALTER TABLE "project" RENAME COLUMN "name" TO "component_name"`);

        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "project" ADD "category" character varying`);
        await queryRunner.query(`ALTER TABLE "project" ADD "formation" character varying`);
        await queryRunner.query(`ALTER TABLE "project" ADD "platform_type" character varying`);
        await queryRunner.query(`ALTER TABLE "project" ADD "OS" character varying`);
        await queryRunner.query(`ALTER TABLE "project" ADD "artifact_type" character varying`);

        await queryRunner.query(`CREATE UNIQUE INDEX "project_component_name_unique_constraint" ON "project" ("component_name")`);
        
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "FK_6991d43331367fb73a9b05b3af0" FOREIGN KEY ("OS") REFERENCES "operation_system"("name") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "FK_883c751dd4821d23ca68fc3ab6d" FOREIGN KEY ("platform_type") REFERENCES "platform"("name") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "FK_153cb871996883304a853d02e8f" FOREIGN KEY ("formation") REFERENCES "formation"("name") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "FK_b2d8a6998de33c634d2e4fba985" FOREIGN KEY ("category") REFERENCES "category"("name") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
}
