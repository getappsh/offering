import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEnableSbomScanToReleaseArtifact1773103000000 implements MigrationInterface {
    name = 'AddEnableSbomScanToReleaseArtifact1773103000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "release_artifact" ADD "enable_sbom_scan" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "release_artifact" DROP COLUMN "enable_sbom_scan"`);
    }

}
