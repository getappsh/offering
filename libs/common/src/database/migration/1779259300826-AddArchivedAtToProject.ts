import { MigrationInterface, QueryRunner } from "typeorm";

export class AddArchivedAtToProject1779259300826 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" ADD COLUMN IF NOT EXISTS "archived_at" TIMESTAMPTZ NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN IF EXISTS "archived_at"`);
    }

}
