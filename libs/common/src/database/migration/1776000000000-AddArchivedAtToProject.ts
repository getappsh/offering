import { MigrationInterface, QueryRunner } from "typeorm";

export class AddArchivedAtToProject1776000000000 implements MigrationInterface {
    name = 'AddArchivedAtToProject1776000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" ADD COLUMN IF NOT EXISTS "archived_at" TIMESTAMPTZ NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN IF EXISTS "archived_at"`);
    }
}
