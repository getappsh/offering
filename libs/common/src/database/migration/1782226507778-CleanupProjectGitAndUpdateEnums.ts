import { MigrationInterface, QueryRunner } from "typeorm";

export class CleanupProjectGitAndUpdateEnums1782226507778 implements MigrationInterface {
    name = 'CleanupProjectGitAndUpdateEnums1782226507778'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_git_source" DROP CONSTRAINT "FK_project_git_source_project"`);
        await queryRunner.query(`ALTER TABLE "release_artifact" DROP CONSTRAINT "CHK_release_artifact_type_columns"`);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "git_clone_interval"`);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "git_clone_url"`);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "git_ssh_key"`);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "git_webhook_url"`);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "git_branch"`);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "git_https_username"`);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "git_https_password"`);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "git_getapp_file_path"`);
        await queryRunner.query(`ALTER TABLE "release_artifact" ALTER COLUMN "enable_sbom_scan" SET DEFAULT false`);
        await queryRunner.query(`ALTER TYPE "public"."rule_type_enum" RENAME TO "rule_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."rules_type_enum" AS ENUM('policy', 'restriction')`);
        await queryRunner.query(`ALTER TABLE "rules" ALTER COLUMN "type" TYPE "public"."rules_type_enum" USING "type"::"text"::"public"."rules_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."rule_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "project_git_source" ALTER COLUMN "projectId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TYPE "public"."project_project_type_enum" RENAME TO "project_project_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."project_project_type_enum" AS ENUM('product', 'application', 'lib', 'bundle', 'infra', 'config', 'config_map')`);
        await queryRunner.query(`ALTER TABLE "project" ALTER COLUMN "project_type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "project" ALTER COLUMN "project_type" TYPE "public"."project_project_type_enum" USING "project_type"::"text"::"public"."project_project_type_enum"`);
        await queryRunner.query(`ALTER TABLE "project" ALTER COLUMN "project_type" SET DEFAULT 'application'`);
        await queryRunner.query(`DROP TYPE "public"."project_project_type_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."delivery_status_type_enum" RENAME TO "delivery_status_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."delivery_status_type_enum" AS ENUM('software', 'map', 'cache', 'config')`);
        await queryRunner.query(`ALTER TABLE "delivery_status" ALTER COLUMN "type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "delivery_status" ALTER COLUMN "type" TYPE "public"."delivery_status_type_enum" USING "type"::"text"::"public"."delivery_status_type_enum"`);
        await queryRunner.query(`ALTER TABLE "delivery_status" ALTER COLUMN "type" SET DEFAULT 'software'`);
        await queryRunner.query(`DROP TYPE "public"."delivery_status_type_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."deploy_status_type_enum" RENAME TO "deploy_status_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."deploy_status_type_enum" AS ENUM('software', 'map', 'cache', 'config')`);
        await queryRunner.query(`ALTER TABLE "deploy_status" ALTER COLUMN "type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "deploy_status" ALTER COLUMN "type" TYPE "public"."deploy_status_type_enum" USING "type"::"text"::"public"."deploy_status_type_enum"`);
        await queryRunner.query(`ALTER TABLE "deploy_status" ALTER COLUMN "type" SET DEFAULT 'software'`);
        await queryRunner.query(`DROP TYPE "public"."deploy_status_type_enum_old"`);
        await queryRunner.query(`CREATE INDEX "IDX_982d910584336e66184c0941f7" ON "rules" ("type", "isActive") `);
        await queryRunner.query(`ALTER TABLE "release_artifact" ADD CONSTRAINT "CHK_110e8a408ee2065a66a5ea1a2b" CHECK (((file_upload_id IS NOT NULL AND type = 'file') OR (docker_image_url IS NOT NULL AND type = 'docker_image') OR (package_version IS NOT NULL AND type IN ('rpm', 'deb'))))`);
        await queryRunner.query(`ALTER TABLE "project_git_source" ADD CONSTRAINT "FK_2d5f7d877d61fc7cde94c6fef9b" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_git_source" DROP CONSTRAINT "FK_2d5f7d877d61fc7cde94c6fef9b"`);
        await queryRunner.query(`ALTER TABLE "release_artifact" DROP CONSTRAINT "CHK_110e8a408ee2065a66a5ea1a2b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_982d910584336e66184c0941f7"`);
        await queryRunner.query(`CREATE TYPE "public"."deploy_status_type_enum_old" AS ENUM('cache', 'map', 'software')`);
        await queryRunner.query(`ALTER TABLE "deploy_status" ALTER COLUMN "type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "deploy_status" ALTER COLUMN "type" TYPE "public"."deploy_status_type_enum_old" USING "type"::"text"::"public"."deploy_status_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "deploy_status" ALTER COLUMN "type" SET DEFAULT 'software'`);
        await queryRunner.query(`DROP TYPE "public"."deploy_status_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."deploy_status_type_enum_old" RENAME TO "deploy_status_type_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."delivery_status_type_enum_old" AS ENUM('cache', 'map', 'software')`);
        await queryRunner.query(`ALTER TABLE "delivery_status" ALTER COLUMN "type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "delivery_status" ALTER COLUMN "type" TYPE "public"."delivery_status_type_enum_old" USING "type"::"text"::"public"."delivery_status_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "delivery_status" ALTER COLUMN "type" SET DEFAULT 'software'`);
        await queryRunner.query(`DROP TYPE "public"."delivery_status_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."delivery_status_type_enum_old" RENAME TO "delivery_status_type_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."project_project_type_enum_old" AS ENUM('application', 'bundle', 'config', 'config_map', 'formation', 'infra', 'lib', 'product')`);
        await queryRunner.query(`ALTER TABLE "project" ALTER COLUMN "project_type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "project" ALTER COLUMN "project_type" TYPE "public"."project_project_type_enum_old" USING "project_type"::"text"::"public"."project_project_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "project" ALTER COLUMN "project_type" SET DEFAULT 'application'`);
        await queryRunner.query(`DROP TYPE "public"."project_project_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."project_project_type_enum_old" RENAME TO "project_project_type_enum"`);
        await queryRunner.query(`ALTER TABLE "project_git_source" ALTER COLUMN "projectId" SET NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."rule_type_enum_old" AS ENUM('policy', 'push', 'restriction')`);
        await queryRunner.query(`ALTER TABLE "rules" ALTER COLUMN "type" TYPE "public"."rule_type_enum_old" USING "type"::"text"::"public"."rule_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."rules_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."rule_type_enum_old" RENAME TO "rule_type_enum"`);
        await queryRunner.query(`ALTER TABLE "release_artifact" ALTER COLUMN "enable_sbom_scan" SET DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "project" ADD "git_getapp_file_path" character varying`);
        await queryRunner.query(`ALTER TABLE "project" ADD "git_https_password" text`);
        await queryRunner.query(`ALTER TABLE "project" ADD "git_https_username" character varying`);
        await queryRunner.query(`ALTER TABLE "project" ADD "git_branch" character varying`);
        await queryRunner.query(`ALTER TABLE "project" ADD "git_webhook_url" character varying`);
        await queryRunner.query(`ALTER TABLE "project" ADD "git_ssh_key" text`);
        await queryRunner.query(`ALTER TABLE "project" ADD "git_clone_url" character varying`);
        await queryRunner.query(`ALTER TABLE "project" ADD "git_clone_interval" integer`);
        await queryRunner.query(`ALTER TABLE "release_artifact" ADD CONSTRAINT "CHK_release_artifact_type_columns" CHECK ((((file_upload_id IS NOT NULL) AND (type = 'file'::release_artifact_type_enum)) OR ((docker_image_url IS NOT NULL) AND (type = 'docker_image'::release_artifact_type_enum)) OR ((file_upload_id IS NULL) AND (docker_image_url IS NULL))))`);
        await queryRunner.query(`ALTER TABLE "project_git_source" ADD CONSTRAINT "FK_project_git_source_project" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
