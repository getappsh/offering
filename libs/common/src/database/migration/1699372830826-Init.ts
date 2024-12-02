import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1699372830826 implements MigrationInterface {
    name = 'Init1699372830826'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DO $$ 
        BEGIN 
          IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'version_packages_formation_enum') THEN
            CREATE TYPE "public"."version_packages_formation_enum" AS ENUM('yaat', 'yatush', 'hqtactic');
          END IF;
        END $$;`);
        await queryRunner.query(`DO $$ 
        BEGIN 
          IF NOT EXISTS (
            SELECT 1 
            FROM pg_type
            WHERE typname = 'version_packages_formation_enum'
          ) THEN
            CREATE TYPE "public"."version_packages_formation_enum" AS ENUM('yaat', 'yatush', 'hqtactic');
          END IF;
        END $$;`);
        await queryRunner.query(`DO $$ 
        BEGIN 
          IF NOT EXISTS (
            SELECT 1 
            FROM pg_type
            WHERE typname = 'version_packages_status_enum'
          ) THEN
            CREATE TYPE "public"."version_packages_status_enum" AS ENUM('inProgress', 'ready');
          END IF;
        END $$;`);

        await queryRunner.query(`DO $$ 
        BEGIN 
          IF NOT EXISTS (
            SELECT 1 
            FROM pg_type
            WHERE typname = 'version_packages_os_enum'
          ) THEN
            CREATE TYPE "public"."version_packages_os_enum" AS ENUM('android', 'windows', 'linux');
          END IF;
        END $$;`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "version_packages" ("id" SERIAL NOT NULL, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "lastUpdatedDate" TIMESTAMP NOT NULL DEFAULT now(), "OS" "public"."version_packages_os_enum" NOT NULL, "formation" "public"."version_packages_formation_enum" NOT NULL, "from_version" character varying NOT NULL, "to_version" character varying NOT NULL, "status" "public"."version_packages_status_enum" NOT NULL DEFAULT 'inProgress', "utl" character varying, CONSTRAINT "PK_eaedcfcdf341f839e321c2e376c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_33d8d8c8c7d26b9bee28d78332" ON "version_packages" ("OS", "formation", "from_version", "to_version") `);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "member" ("id" SERIAL NOT NULL, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "lastUpdatedDate" TIMESTAMP NOT NULL DEFAULT now(), "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "email" character varying NOT NULL, "default_project" integer, CONSTRAINT "PK_97cbbe986ce9d14ca5894fdc072" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS "member_email_unique_constraint" ON "member" ("email") `);
        await queryRunner.query(`DO $$ 
        BEGIN 
          IF NOT EXISTS (
            SELECT 1 
            FROM pg_type
            WHERE typname = 'member_project_role_enum'
          ) THEN
            CREATE TYPE "public"."member_project_role_enum" AS ENUM('project-owner', 'project-admin', 'project-member');
          END IF;
        END $$;`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "member_project" ("id" SERIAL NOT NULL, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "lastUpdatedDate" TIMESTAMP NOT NULL DEFAULT now(), "role" "public"."member_project_role_enum" NOT NULL DEFAULT 'project-member', "projectId" integer, "memberId" integer, CONSTRAINT "member_project_unique_constraint" UNIQUE ("projectId", "memberId"), CONSTRAINT "PK_87913eee42a32bebe9af67d7526" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS"platform" ("name" character varying NOT NULL, CONSTRAINT "PK_b9b57ec16b9c2ac927aa62b8b3f" PRIMARY KEY ("name"))`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "formation" ("name" character varying NOT NULL, CONSTRAINT "PK_311c9c94be443daeaeb5fd56444" PRIMARY KEY ("name"))`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "category" ("name" character varying NOT NULL, CONSTRAINT "PK_23c05c292c439d77b0de816b500" PRIMARY KEY ("name"))`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "operation_system" ("name" character varying NOT NULL, CONSTRAINT "PK_616a1c9efbc76d361773ecb2f65" PRIMARY KEY ("name"))`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "project" ("id" SERIAL NOT NULL, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "lastUpdatedDate" TIMESTAMP NOT NULL DEFAULT now(), "component_name" character varying NOT NULL, "artifact_type" character varying, "description" character varying NOT NULL, "tokens" text, "OS" character varying, "platform_type" character varying, "formation" character varying, "category" character varying, CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS "project_component_name_unique_constraint" ON "project" ("component_name") `);
        await queryRunner.query(`DO $$ 
        BEGIN 
          IF NOT EXISTS (
            SELECT 1 
            FROM pg_type
            WHERE typname = 'map_status_enum'
          ) THEN
            CREATE TYPE "public"."map_status_enum" AS ENUM('Start', 'InProgress', 'Done', 'Cancel', 'Error');
          END IF;
        END $$;`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "map" ("catalog_id" character varying NOT NULL, "product_id" character varying, "product_name" character varying, "file_name" character varying, "zoom_level" integer, "create_date" TIMESTAMP, "bounding_box" character varying, "package_url" character varying, "status" "public"."map_status_enum" NOT NULL DEFAULT 'Start', CONSTRAINT "PK_eece6afcab5df8c3b10b6b11cbc" PRIMARY KEY ("catalog_id"))`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "devices_group" ("id" SERIAL NOT NULL, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "lastUpdatedDate" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "description" character varying, "parentId" integer, CONSTRAINT "UQ_068b550ce8d0f36cd465768dd42" UNIQUE ("name"), CONSTRAINT "PK_d430332b2d61167e34a67b0cec1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "device" ("ID" character varying NOT NULL, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "lastUpdatedDate" TIMESTAMP NOT NULL DEFAULT now(), "MAC" character varying, "IP" character varying, "OS" character varying, "serial_number" character varying, "possible_bandwidth" character varying, "available_storage" character varying, "groupsId" integer, CONSTRAINT "PK_9272d4998f0def0ef365de2b1a5" PRIMARY KEY ("ID"))`);
        await queryRunner.query(`DO $$ 
        BEGIN 
          IF NOT EXISTS (
            SELECT 1 
            FROM pg_type
            WHERE typname = 'upload_version_upload_status_enum'
          ) THEN
            CREATE TYPE "public"."upload_version_upload_status_enum" AS ENUM('started', 'downloading-from-url', 'fail-to-download', 'uploading-to-s3', 'fail-to-upload', 'in-progress', 'ready', 'error');
          END IF;
        END $$;`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "upload_version" ("catalog_id" character varying NOT NULL, "id" integer, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "lastUpdatedDate" TIMESTAMP NOT NULL DEFAULT now(), "platform" character varying NOT NULL, "component" character varying NOT NULL, "formation" character varying NOT NULL, "OS" character varying, "virtual_size" integer NOT NULL DEFAULT '0', "version" character varying NOT NULL, "base_version" character varying, "prev_version" character varying, "metadata" jsonb NOT NULL DEFAULT '{}', "s3_url" character varying, "upload_status" "public"."upload_version_upload_status_enum" NOT NULL DEFAULT 'started', "deployment_status" character varying, "security_status" character varying, "policy_status" character varying, "projectId" integer, CONSTRAINT "platform_component_formation_version_unique_constraint" UNIQUE ("platform", "component", "formation", "version"), CONSTRAINT "PK_a812353ea2c66b3420890de579b" PRIMARY KEY ("catalog_id"))`);
        await queryRunner.query(`DO $$ 
        BEGIN 
          IF NOT EXISTS (
            SELECT 1 
            FROM pg_type
            WHERE typname = 'discovery_message_discoverytype_enum'
          ) THEN
            CREATE TYPE "public"."discovery_message_discoverytype_enum" AS ENUM('get-app', 'get-map', 'mTls');
          END IF;
        END $$;`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "discovery_message" ("id" SERIAL NOT NULL, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "lastUpdatedDate" TIMESTAMP NOT NULL DEFAULT now(), "personal_device" jsonb, "situational_device" jsonb, "discovery_data" jsonb, "discoveryType" "public"."discovery_message_discoverytype_enum" NOT NULL, "map" jsonb, "mTls_status" text, "deviceID" character varying, CONSTRAINT "PK_e198476b47dcb7ce72c3672004e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`DO $$ 
        BEGIN 
          IF NOT EXISTS (
            SELECT 1 
            FROM pg_type
            WHERE typname = 'delivery_status_delivery_status_enum'
          ) THEN
            CREATE TYPE "public"."delivery_status_delivery_status_enum" AS ENUM('Start', 'Done', 'Error', 'Cancelled', 'Pause', 'Continue', 'Download');
          END IF;
        END $$;`);
        await queryRunner.query(`DO $$ 
        BEGIN 
          IF NOT EXISTS (
            SELECT 1 
            FROM pg_type
            WHERE typname = 'delivery_status_type_enum'
          ) THEN
            CREATE TYPE "public"."delivery_status_type_enum" AS ENUM('software', 'map', 'cache');
          END IF;
        END $$;`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "delivery_status" ("id" SERIAL NOT NULL, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "lastUpdatedDate" TIMESTAMP NOT NULL DEFAULT now(), "catalogId" character varying NOT NULL, "delivery_status" "public"."delivery_status_delivery_status_enum" NOT NULL DEFAULT 'Start', "type" "public"."delivery_status_type_enum" NOT NULL DEFAULT 'software', "download_start" TIMESTAMP, "download_stop" TIMESTAMP, "download_done" TIMESTAMP, "bit_number" integer, "download_speed" numeric, "download_data" numeric, "download_estimate_time" integer, "current_time" TIMESTAMP, "deviceID" character varying, CONSTRAINT "PK_7402e08a6496ff740a56399e8b6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`DO $$ 
        BEGIN 
          IF NOT EXISTS (
            SELECT 1 
            FROM pg_type
            WHERE typname = 'deploy_status_status_enum'
          ) THEN
            CREATE TYPE "public"."deploy_status_status_enum" AS ENUM('Start', 'Done', 'Installing', 'Continue', 'Pause', 'Cancelled', 'Error', 'Uninstall');
          END IF;
        END $$;`);
        await queryRunner.query(`DO $$ 
        BEGIN 
          IF NOT EXISTS (
            SELECT 1 
            FROM pg_type
            WHERE typname = 'deploy_status_type_enum'
          ) THEN
            CREATE TYPE "public"."deploy_status_type_enum" AS ENUM('software', 'map', 'cache');
          END IF;
        END $$;`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "deploy_status" ("id" SERIAL NOT NULL, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "lastUpdatedDate" TIMESTAMP NOT NULL DEFAULT now(), "catalogId" character varying NOT NULL, "status" "public"."deploy_status_status_enum" NOT NULL DEFAULT 'Start', "type" "public"."deploy_status_type_enum" NOT NULL DEFAULT 'software', "deploy_start" TIMESTAMP, "deploy_stop" TIMESTAMP, "deploy_done" TIMESTAMP, "deploy_estimate_time" integer, "current_time" TIMESTAMP, "deviceID" character varying, CONSTRAINT "PK_09c7e50b70526412af063a09a6f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "device_component" ("device_ID" character varying NOT NULL, "component_catalog_id" character varying NOT NULL, CONSTRAINT "PK_5536e424deb25c711f50fe37ff8" PRIMARY KEY ("device_ID", "component_catalog_id"))`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_1f163ac3d48a67c9bf6a3d247f" ON "device_component" ("device_ID") `);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_8a6cec72480ff6c70a65125166" ON "device_component" ("component_catalog_id") `);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "device_map" ("device_ID" character varying NOT NULL, "map_catalog_id" character varying NOT NULL, CONSTRAINT "PK_2568630761a5f9f48724ebfc9dd" PRIMARY KEY ("device_ID", "map_catalog_id"))`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_b82e4a49e78c4d2c9125039609" ON "device_map" ("device_ID") `);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS"IDX_4b78115c58fadb87995b90840c" ON "device_map" ("map_catalog_id") `);
        
        await queryRunner.query(`ALTER TABLE "device_map" DROP CONSTRAINT IF EXISTS  "FK_4b78115c58fadb87995b90840c5"`);
        await queryRunner.query(`ALTER TABLE "device_map" DROP CONSTRAINT IF EXISTS  "FK_b82e4a49e78c4d2c9125039609d"`);
        await queryRunner.query(`ALTER TABLE "device_component" DROP CONSTRAINT IF EXISTS  "FK_8a6cec72480ff6c70a651251660"`);
        await queryRunner.query(`ALTER TABLE "device_component" DROP CONSTRAINT IF EXISTS  "FK_1f163ac3d48a67c9bf6a3d247f1"`);
        await queryRunner.query(`ALTER TABLE "deploy_status" DROP CONSTRAINT IF EXISTS  "FK_42dacf83f566beb80b0e7b92abc"`);
        await queryRunner.query(`ALTER TABLE "delivery_status" DROP CONSTRAINT IF EXISTS  "FK_2e3dcab53dd4e65ed2e0da0567a"`);
        await queryRunner.query(`ALTER TABLE "discovery_message" DROP CONSTRAINT IF EXISTS  "FK_62c0a7b76a04a5ff7b82f81db70"`);
        await queryRunner.query(`ALTER TABLE "upload_version" DROP CONSTRAINT IF EXISTS  "FK_2375d667f3072cf531b17ff8720"`);
        await queryRunner.query(`ALTER TABLE "device" DROP CONSTRAINT IF EXISTS  "FK_291b4f16ea2616c63998ca2bf4d"`);
        await queryRunner.query(`ALTER TABLE "devices_group" DROP CONSTRAINT IF EXISTS  "FK_b1f274fbb2b18538441e9009e03"`);
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT IF EXISTS  "FK_b2d8a6998de33c634d2e4fba985"`);
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT IF EXISTS  "FK_153cb871996883304a853d02e8f"`);
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT IF EXISTS  "FK_883c751dd4821d23ca68fc3ab6d"`);
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT IF EXISTS  "FK_6991d43331367fb73a9b05b3af0"`);
        await queryRunner.query(`ALTER TABLE "member_project" DROP CONSTRAINT IF EXISTS  "FK_3590a58e0e74ba70d64acc7b0f2"`);
        await queryRunner.query(`ALTER TABLE "member_project" DROP CONSTRAINT IF EXISTS  "FK_b91d0b2fdcd6275e1ec31f1ba46"`);
        await queryRunner.query(`ALTER TABLE "member" DROP CONSTRAINT IF EXISTS  "FK_ce6af544306f2b15cc67b98f907"`);

        await queryRunner.query(`ALTER TABLE "member" ADD CONSTRAINT "FK_ce6af544306f2b15cc67b98f907" FOREIGN KEY ("default_project") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "member_project" ADD CONSTRAINT "FK_b91d0b2fdcd6275e1ec31f1ba46" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "member_project" ADD CONSTRAINT "FK_3590a58e0e74ba70d64acc7b0f2" FOREIGN KEY ("memberId") REFERENCES "member"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "FK_6991d43331367fb73a9b05b3af0" FOREIGN KEY ("OS") REFERENCES "operation_system"("name") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "FK_883c751dd4821d23ca68fc3ab6d" FOREIGN KEY ("platform_type") REFERENCES "platform"("name") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "FK_153cb871996883304a853d02e8f" FOREIGN KEY ("formation") REFERENCES "formation"("name") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "FK_b2d8a6998de33c634d2e4fba985" FOREIGN KEY ("category") REFERENCES "category"("name") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "devices_group" ADD CONSTRAINT "FK_b1f274fbb2b18538441e9009e03" FOREIGN KEY ("parentId") REFERENCES "devices_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "device" ADD CONSTRAINT "FK_291b4f16ea2616c63998ca2bf4d" FOREIGN KEY ("groupsId") REFERENCES "devices_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "upload_version" ADD CONSTRAINT "FK_2375d667f3072cf531b17ff8720" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "discovery_message" ADD CONSTRAINT "FK_62c0a7b76a04a5ff7b82f81db70" FOREIGN KEY ("deviceID") REFERENCES "device"("ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "delivery_status" ADD CONSTRAINT "FK_2e3dcab53dd4e65ed2e0da0567a" FOREIGN KEY ("deviceID") REFERENCES "device"("ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "deploy_status" ADD CONSTRAINT "FK_42dacf83f566beb80b0e7b92abc" FOREIGN KEY ("deviceID") REFERENCES "device"("ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "device_component" ADD CONSTRAINT "FK_1f163ac3d48a67c9bf6a3d247f1" FOREIGN KEY ("device_ID") REFERENCES "device"("ID") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "device_component" ADD CONSTRAINT "FK_8a6cec72480ff6c70a651251660" FOREIGN KEY ("component_catalog_id") REFERENCES "upload_version"("catalog_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "device_map" ADD CONSTRAINT "FK_b82e4a49e78c4d2c9125039609d" FOREIGN KEY ("device_ID") REFERENCES "device"("ID") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "device_map" ADD CONSTRAINT "FK_4b78115c58fadb87995b90840c5" FOREIGN KEY ("map_catalog_id") REFERENCES "map"("catalog_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "device_map" DROP CONSTRAINT "FK_4b78115c58fadb87995b90840c5"`);
        await queryRunner.query(`ALTER TABLE "device_map" DROP CONSTRAINT "FK_b82e4a49e78c4d2c9125039609d"`);
        await queryRunner.query(`ALTER TABLE "device_component" DROP CONSTRAINT "FK_8a6cec72480ff6c70a651251660"`);
        await queryRunner.query(`ALTER TABLE "device_component" DROP CONSTRAINT "FK_1f163ac3d48a67c9bf6a3d247f1"`);
        await queryRunner.query(`ALTER TABLE "deploy_status" DROP CONSTRAINT "FK_42dacf83f566beb80b0e7b92abc"`);
        await queryRunner.query(`ALTER TABLE "delivery_status" DROP CONSTRAINT "FK_2e3dcab53dd4e65ed2e0da0567a"`);
        await queryRunner.query(`ALTER TABLE "discovery_message" DROP CONSTRAINT "FK_62c0a7b76a04a5ff7b82f81db70"`);
        await queryRunner.query(`ALTER TABLE "upload_version" DROP CONSTRAINT "FK_2375d667f3072cf531b17ff8720"`);
        await queryRunner.query(`ALTER TABLE "device" DROP CONSTRAINT "FK_291b4f16ea2616c63998ca2bf4d"`);
        await queryRunner.query(`ALTER TABLE "devices_group" DROP CONSTRAINT "FK_b1f274fbb2b18538441e9009e03"`);
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_b2d8a6998de33c634d2e4fba985"`);
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_153cb871996883304a853d02e8f"`);
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_883c751dd4821d23ca68fc3ab6d"`);
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_6991d43331367fb73a9b05b3af0"`);
        await queryRunner.query(`ALTER TABLE "member_project" DROP CONSTRAINT "FK_3590a58e0e74ba70d64acc7b0f2"`);
        await queryRunner.query(`ALTER TABLE "member_project" DROP CONSTRAINT "FK_b91d0b2fdcd6275e1ec31f1ba46"`);
        await queryRunner.query(`ALTER TABLE "member" DROP CONSTRAINT "FK_ce6af544306f2b15cc67b98f907"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4b78115c58fadb87995b90840c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b82e4a49e78c4d2c9125039609"`);
        await queryRunner.query(`DROP TABLE "device_map"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8a6cec72480ff6c70a65125166"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1f163ac3d48a67c9bf6a3d247f"`);
        await queryRunner.query(`DROP TABLE "device_component"`);
        await queryRunner.query(`DROP TABLE "deploy_status"`);
        await queryRunner.query(`DROP TYPE "public"."deploy_status_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."deploy_status_status_enum"`);
        await queryRunner.query(`DROP TABLE "delivery_status"`);
        await queryRunner.query(`DROP TYPE "public"."delivery_status_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."delivery_status_delivery_status_enum"`);
        await queryRunner.query(`DROP TABLE "discovery_message"`);
        await queryRunner.query(`DROP TYPE "public"."discovery_message_discoverytype_enum"`);
        await queryRunner.query(`DROP TABLE "upload_version"`);
        await queryRunner.query(`DROP TYPE "public"."upload_version_upload_status_enum"`);
        await queryRunner.query(`DROP TABLE "device"`);
        await queryRunner.query(`DROP TABLE "devices_group"`);
        await queryRunner.query(`DROP TABLE "map"`);
        await queryRunner.query(`DROP TYPE "public"."map_status_enum"`);
        await queryRunner.query(`DROP INDEX "public"."project_component_name_unique_constraint"`);
        await queryRunner.query(`DROP TABLE "project"`);
        await queryRunner.query(`DROP TABLE "operation_system"`);
        await queryRunner.query(`DROP TABLE "category"`);
        await queryRunner.query(`DROP TABLE "formation"`);
        await queryRunner.query(`DROP TABLE "platform"`);
        await queryRunner.query(`DROP TABLE "member_project"`);
        await queryRunner.query(`DROP TYPE "public"."member_project_role_enum"`);
        await queryRunner.query(`DROP INDEX "public"."member_email_unique_constraint"`);
        await queryRunner.query(`DROP TABLE "member"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_33d8d8c8c7d26b9bee28d78332"`);
        await queryRunner.query(`DROP TABLE "version_packages"`);
        await queryRunner.query(`DROP TYPE "public"."version_packages_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."version_packages_formation_enum"`);
        await queryRunner.query(`DROP TYPE "public"."version_packages_os_enum"`);
    }

}
