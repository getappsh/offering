import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLatestAndReleasedAtToRelease1740322526217 implements MigrationInterface {
    name = 'AddLatestAndReleasedAtToRelease1740322526217'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "release" ADD "latest" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`
            UPDATE "release" r
            SET latest = true
            WHERE r.catalog_id = (
                SELECT r2.catalog_id
                FROM "release" r2
                WHERE r2.project_id = r.project_id AND r2.status = 'released'
                ORDER BY r2.sort_order DESC
                LIMIT 1
            );`
        )
        await queryRunner.query(`ALTER TABLE "release" ADD "released_at" TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "release" DROP COLUMN "released_at"`);
        await queryRunner.query(`ALTER TABLE "release" DROP COLUMN "latest"`);
    }

}
