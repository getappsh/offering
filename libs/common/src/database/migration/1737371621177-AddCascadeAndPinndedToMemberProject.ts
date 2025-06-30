import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCascadeAndPinndedToMemberProject1737371621177 implements MigrationInterface {
    name = 'AddCascadeAndPinndedToMemberProject1737371621177'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "member_project" DROP CONSTRAINT "FK_b91d0b2fdcd6275e1ec31f1ba46"`);
        await queryRunner.query(`ALTER TABLE "member_project" ADD "pinned" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "member_project" ADD CONSTRAINT "FK_b91d0b2fdcd6275e1ec31f1ba46" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "member_project" DROP CONSTRAINT "FK_b91d0b2fdcd6275e1ec31f1ba46"`);
        await queryRunner.query(`ALTER TABLE "member_project" DROP COLUMN "pinned"`);
        await queryRunner.query(`ALTER TABLE "member_project" ADD CONSTRAINT "FK_b91d0b2fdcd6275e1ec31f1ba46" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
