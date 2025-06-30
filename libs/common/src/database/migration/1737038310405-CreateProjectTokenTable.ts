import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProjectTokenTable1737038310405 implements MigrationInterface {
    name = 'CreateProjectTokenTable1737038310405'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "project_token" ("id" SERIAL NOT NULL, "createdDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "lastUpdatedDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, "token" character varying NOT NULL, "expiration_date" TIMESTAMP WITH TIME ZONE, "never_expires" boolean NOT NULL DEFAULT false, "is_active" boolean NOT NULL DEFAULT true, "projectId" integer, CONSTRAINT "UQ_4aa453d58ea076942521742a895" UNIQUE ("token"), CONSTRAINT "PK_7b54ddbc20b8079e6e1d32ffc89" PRIMARY KEY ("id"))`);
        
        const projects = await queryRunner.query(`SELECT id, tokens FROM "project" WHERE tokens IS NOT NULL`);
        const expirationDate = new Date();
        expirationDate.setFullYear(expirationDate.getFullYear() + 3);

        for (const project of projects) {
            const { id: projectId, tokens } = project;

            if (tokens) {
                const tokenArray = tokens.split(',');

                for (const token of tokenArray) {
                    await queryRunner.query(
                        `
                        INSERT INTO "project_token" ("name", "token", "expiration_date", "projectId")
                        VALUES ($1, $2, $3, $4)
                        `,
                        [`Generic Token`, token.trim(), expirationDate.toISOString(), projectId]
                    );
                }
            }
        }
        
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "tokens"`);
        await queryRunner.query(`ALTER TABLE "project_token" ADD CONSTRAINT "FK_35b44a95340940342d264b400f8" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_token" DROP CONSTRAINT "FK_35b44a95340940342d264b400f8"`);
        await queryRunner.query(`ALTER TABLE "project" ADD "tokens" text`);
        await queryRunner.query(`DROP TABLE "project_token"`);
    }

}
