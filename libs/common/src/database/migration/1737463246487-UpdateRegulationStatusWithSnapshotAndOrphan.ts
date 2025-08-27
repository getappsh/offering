import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateRegulationStatusWithSnapshotAndOrphan1737463246487 implements MigrationInterface {
    name = 'UpdateRegulationStatusWithSnapshotAndOrphan1737463246487'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "regulation_status" DROP CONSTRAINT "FK_59f8e500f2dd2cb4d2fcd15a5dc"`);
        await queryRunner.query(`ALTER TABLE "regulation_status" ADD "regulation_snapshot" jsonb`);
        await queryRunner.query(`ALTER TABLE "regulation_status" DROP CONSTRAINT "regulation_version_unique_constraint"`);
        await queryRunner.query(`ALTER TABLE "regulation_status" ALTER COLUMN "regulation_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "regulation_status" ADD CONSTRAINT "regulation_version_unique_constraint" UNIQUE ("regulation_id", "version_id")`);
        await queryRunner.query(`ALTER TABLE "regulation_status" ADD CONSTRAINT "FK_59f8e500f2dd2cb4d2fcd15a5dc" FOREIGN KEY ("regulation_id") REFERENCES "regulation"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "regulation_status" DROP CONSTRAINT "FK_59f8e500f2dd2cb4d2fcd15a5dc"`);
        await queryRunner.query(`ALTER TABLE "regulation_status" DROP CONSTRAINT "regulation_version_unique_constraint"`);
        await queryRunner.query(`ALTER TABLE "regulation_status" ALTER COLUMN "regulation_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "regulation_status" ADD CONSTRAINT "regulation_version_unique_constraint" UNIQUE ("version_id", "regulation_id")`);
        await queryRunner.query(`ALTER TABLE "regulation_status" DROP COLUMN "regulation_snapshot"`);
        await queryRunner.query(`ALTER TABLE "regulation_status" ADD CONSTRAINT "FK_59f8e500f2dd2cb4d2fcd15a5dc" FOREIGN KEY ("regulation_id") REFERENCES "regulation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
