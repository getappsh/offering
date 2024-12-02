import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMatomoFieldsToConfigTable1706180373527 implements MigrationInterface {
    name = 'AddMatomoFieldsToConfigTable1706180373527'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "map_configs" ADD "matomo_goal_id" character varying`);
        await queryRunner.query(`ALTER TABLE "map_configs" ADD "matomo_site_id" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "map_configs" DROP COLUMN "matomo_site_id"`);
        await queryRunner.query(`ALTER TABLE "map_configs" DROP COLUMN "matomo_goal_id"`);
    }

}
