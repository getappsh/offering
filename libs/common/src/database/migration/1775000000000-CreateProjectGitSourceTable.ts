import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProjectGitSourceTable1775000000000 implements MigrationInterface {
    name = 'CreateProjectGitSourceTable1775000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "project_git_source" (
                "id" SERIAL NOT NULL,
                "createdDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "lastUpdatedDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "projectId" integer NOT NULL,
                "clone_url" character varying NOT NULL,
                "ssh_key" text,
                "webhook_url" character varying,
                "clone_interval" integer,
                "branch" character varying,
                "https_username" character varying,
                "https_password" text,
                "getapp_file_path" character varying,
                CONSTRAINT "REL_project_git_source_project" UNIQUE ("projectId"),
                CONSTRAINT "PK_project_git_source" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            ALTER TABLE "project_git_source"
            ADD CONSTRAINT "FK_project_git_source_project"
            FOREIGN KEY ("projectId")
            REFERENCES "project"("id")
            ON DELETE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_git_source" DROP CONSTRAINT "FK_project_git_source_project"`);
        await queryRunner.query(`DROP TABLE "project_git_source"`);
    }
}
