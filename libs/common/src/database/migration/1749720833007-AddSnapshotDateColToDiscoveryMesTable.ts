import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSnapshotDateColToDiscoveryMesTable1749720833007 implements MigrationInterface {
    name = 'AddSnapshotDateColToDiscoveryMesTable1749720833007'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "discovery_message" ADD "snap_shote" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`UPDATE "discovery_message" SET "snap_shote" = NOW()`);
        await queryRunner.query(`ALTER TABLE "discovery_message" ALTER COLUMN "snap_shote" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "discovery_message" DROP COLUMN "snap_shote"`);
    }

}
