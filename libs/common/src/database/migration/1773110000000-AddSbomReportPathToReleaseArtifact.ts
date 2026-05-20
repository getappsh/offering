import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSbomReportPathToReleaseArtifact1773110000000 implements MigrationInterface {
  name = 'AddSbomReportPathToReleaseArtifact1773110000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "release_artifact"
      ADD COLUMN IF NOT EXISTS "sbom_report_path" character varying DEFAULT NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "release_artifact"
      DROP COLUMN IF EXISTS "sbom_report_path"
    `);
  }
}
