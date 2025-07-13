import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProgressToDeployStatus1751297864530 implements MigrationInterface {
    name = 'AddProgressToDeployStatus1751297864530'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deploy_status" ADD "progress" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deploy_status" DROP COLUMN "progress"`);
    }

}
