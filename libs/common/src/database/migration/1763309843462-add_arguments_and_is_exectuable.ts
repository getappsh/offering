import { MigrationInterface, QueryRunner } from "typeorm";

export class  add_arguments_and_is_exectuable_1763309843462 implements MigrationInterface {
    name = 'add_arguments_and_is_exectuable_1763309843462'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "release_artifact" ADD "is_executable" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "release_artifact" ADD "arguments" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "release_artifact" DROP COLUMN "arguments"`);
        await queryRunner.query(`ALTER TABLE "release_artifact" DROP COLUMN "is_executable"`);
    }

}
