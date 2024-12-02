import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateMapCongigTable1706545593304 implements MigrationInterface {
    name = 'UpdateMapCongigTable1706545593304'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "map_configs" RENAME COLUMN "matomo_goal_id" TO "matomo_dimension_id"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "map_configs" RENAME COLUMN "matomo_dimension_id" TO "matomo_goal_id"`);
    }

}
