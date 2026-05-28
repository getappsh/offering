import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRpmDebArtifactTypes1775717107000 implements MigrationInterface {
  name = 'AddRpmDebArtifactTypes1775717107000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add new enum values.
    // PostgreSQL forbids referencing newly added enum values in the same transaction,
    // so the CHECK constraint and partial index below are expressed using NULL-checks
    // rather than enum value literals — no forward-references to 'rpm' or 'deb'.
    await queryRunner.query(`ALTER TYPE "public"."release_artifact_type_enum" ADD VALUE IF NOT EXISTS 'rpm'`);
    await queryRunner.query(`ALTER TYPE "public"."release_artifact_type_enum" ADD VALUE IF NOT EXISTS 'deb'`);

    // Add package_version column
    await queryRunner.query(`
      ALTER TABLE "release_artifact"
      ADD COLUMN IF NOT EXISTS "package_version" character varying DEFAULT NULL
    `);

    // Drop the existing CHECK constraint (name is a hash — find it dynamically)
    await queryRunner.query(`
      DO $$
      DECLARE
        v_constraint text;
      BEGIN
        SELECT conname INTO v_constraint
        FROM pg_constraint
        WHERE conrelid = 'release_artifact'::regclass
          AND contype = 'c'
          AND pg_get_constraintdef(oid) LIKE '%file_upload_id%'
        LIMIT 1;

        IF v_constraint IS NOT NULL THEN
          EXECUTE 'ALTER TABLE release_artifact DROP CONSTRAINT ' || quote_ident(v_constraint);
        END IF;
      END
      $$;
    `);

    // New CHECK: file artifacts need file_upload_id, docker artifacts need docker_image_url,
    // package artifacts (rpm/deb) have neither — expressed without referencing the new enum
    // values so the statement is safe within this transaction.
    await queryRunner.query(`
      ALTER TABLE "release_artifact"
      ADD CONSTRAINT "CHK_release_artifact_type_columns"
      CHECK (
        (file_upload_id IS NOT NULL AND type = 'file')
        OR (docker_image_url IS NOT NULL AND type = 'docker_image')
        OR (file_upload_id IS NULL AND docker_image_url IS NULL)
      )
    `);

    // Partial unique index for package artifacts: same NULL-check predicate avoids
    // referencing 'rpm'/'deb' literals in the same transaction.
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "unique_release_package"
      ON "release_artifact" (release_id, artifact_name, type)
      WHERE file_upload_id IS NULL AND docker_image_url IS NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "unique_release_package"`);

    await queryRunner.query(`ALTER TABLE "release_artifact" DROP CONSTRAINT IF EXISTS "CHK_release_artifact_type_columns"`);
    await queryRunner.query(`
      ALTER TABLE "release_artifact"
      ADD CONSTRAINT "CHK_release_artifact_type_columns"
      CHECK (
        (file_upload_id IS NOT NULL AND type = 'file')
        OR (docker_image_url IS NOT NULL AND type = 'docker_image')
      )
    `);

    await queryRunner.query(`ALTER TABLE "release_artifact" DROP COLUMN IF EXISTS "package_version"`);

    // Note: PostgreSQL does not support removing values from an enum type.
    // The 'rpm' and 'deb' values remain in the type after rollback.
  }
}

