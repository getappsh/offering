import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateMapEntitiyWithIsUpdated1705322492819 implements MigrationInterface {
    name = 'UpdateMapEntitiyWithIsUpdated1705322492819'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "map" ADD "max_resolution" double precision`);
        await queryRunner.query(`ALTER TABLE "map" ADD "is_updated" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "delivery" DROP COLUMN "createdDate"`);
        await queryRunner.query(`ALTER TABLE "delivery" ADD "createdDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "delivery" DROP COLUMN "lastUpdatedDate"`);
        await queryRunner.query(`ALTER TABLE "delivery" ADD "lastUpdatedDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "delivery" DROP COLUMN "lastUpdatedDate"`);
        await queryRunner.query(`ALTER TABLE "delivery" ADD "lastUpdatedDate" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "delivery" DROP COLUMN "createdDate"`);
        await queryRunner.query(`ALTER TABLE "delivery" ADD "createdDate" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "map" DROP COLUMN "is_updated"`);
        await queryRunner.query(`ALTER TABLE "map" DROP COLUMN "max_resolution"`);
    }

}
