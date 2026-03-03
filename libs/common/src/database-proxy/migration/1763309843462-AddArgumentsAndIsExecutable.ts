import { MigrationInterface, QueryRunner } from "typeorm";

export class AddArgumentsAndIsExecutable1763309843462 implements MigrationInterface {
    name = 'AddArgumentsAndIsExecutable1763309843462'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "delivery_item" ADD "is_executable" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "delivery_item" ADD "arguments" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "delivery_item" DROP COLUMN "arguments"`);
        await queryRunner.query(`ALTER TABLE "delivery_item" DROP COLUMN "is_executable"`);
    }

}
