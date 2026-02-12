import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsImportedToRelease1769503719765 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add is_imported column to release table with default value false
        await queryRunner.query(`
            ALTER TABLE "release" 
            ADD COLUMN "is_imported" boolean NOT NULL DEFAULT false
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove is_imported column from release table
        await queryRunner.query(`
            ALTER TABLE "release" 
            DROP COLUMN "is_imported"
        `);
    }

}
