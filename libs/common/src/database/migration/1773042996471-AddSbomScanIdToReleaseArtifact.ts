import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSbomScanIdToReleaseArtifact1773042996471 implements MigrationInterface {
    name = 'AddSbomScanIdToReleaseArtifact1773042996471'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "release_artifact" ADD "sbom_scan_id" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "release_artifact" DROP COLUMN "sbom_scan_id"`);
    }

}
