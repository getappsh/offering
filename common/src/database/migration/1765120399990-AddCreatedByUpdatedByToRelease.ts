import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCreatedByUpdatedByToRelease1765120399990 implements MigrationInterface {
    name = 'AddCreatedByUpdatedByToRelease1765120399990'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "release" ADD COLUMN IF NOT EXISTS "created_by" character varying`);
        await queryRunner.query(`ALTER TABLE "release" ADD COLUMN IF NOT EXISTS "updated_by" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "release" DROP COLUMN IF EXISTS "updated_by"`);
        await queryRunner.query(`ALTER TABLE "release" DROP COLUMN IF EXISTS "created_by"`);
    }
}
