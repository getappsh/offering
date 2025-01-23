import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStatusToMemberProject1735644924641 implements MigrationInterface {
    name = 'AddStatusToMemberProject1735644924641'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."member_project_status_enum" AS ENUM('invited', 'active', 'inactive')`);
        await queryRunner.query(`ALTER TABLE "member_project" ADD "status" "public"."member_project_status_enum" NOT NULL DEFAULT 'active'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "member_project" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."member_project_status_enum"`);
    }

}
