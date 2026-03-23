import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOSTable1771342807293 implements MigrationInterface {
    name = 'AddOSTable1771342807293'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "os" ("id" character varying(50) NOT NULL, "name" character varying(100) NOT NULL, "description" text, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_aabe1caa41ca9f58a18ec4832ab" PRIMARY KEY ("id"))`);
        
        // Seed OS data
        await queryRunner.query(`
            INSERT INTO "os" ("id", "name", "description") VALUES
            ('android', 'Android', 'Android mobile and tablet operating system'),
            ('windows', 'Windows', 'Microsoft Windows operating system'),
            ('linux', 'Linux', 'Linux-based operating systems'),
            ('macos', 'macOS', 'Apple macOS operating system')
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "os"`);
    }

}
