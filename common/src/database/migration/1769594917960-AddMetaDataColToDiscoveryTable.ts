import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMetaDataColToDiscoveryTable1769594917960 implements MigrationInterface {
    name = 'AddMetaDataColToDiscoveryTable1769594917960'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "discovery_message" ADD "meta_data" jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "discovery_message" DROP COLUMN "meta_data"`);
    }

}
