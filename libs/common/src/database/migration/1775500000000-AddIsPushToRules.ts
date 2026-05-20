import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsPushToRules1775500000000 implements MigrationInterface {
    name = 'AddIsPushToRules1775500000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "rules"
            ADD COLUMN IF NOT EXISTS "isPush" boolean NOT NULL DEFAULT false
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "rules"
            DROP COLUMN IF EXISTS "isPush"
        `);
    }
}
