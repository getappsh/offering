import { MigrationInterface, QueryRunner } from "typeorm";
import { DEFAULT_ALLOW_ALL_DEVICES_RULE_NAME, DEFAULT_ALLOW_ALL_DEVICES_RULE_ID } from "../../rules/constants";

export class CreateRulesTables1765200000000 implements MigrationInterface {
    name = 'CreateRulesTables1765200000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Enable uuid-ossp extension if not already enabled
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

        // Create rule_type enum if it doesn't exist
        await queryRunner.query(`
            DO $$ BEGIN
                CREATE TYPE "public"."rule_type_enum" AS ENUM('policy', 'restriction');
            EXCEPTION
                WHEN duplicate_object THEN null;
            END $$;
        `);

        // Create rules table if it doesn't exist
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "rules" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying(255) NOT NULL,
                "description" text,
                "type" "public"."rule_type_enum" NOT NULL,
                "version" integer NOT NULL DEFAULT '1',
                "isActive" boolean NOT NULL DEFAULT true,
                "rule" jsonb NOT NULL,
                "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_rules" PRIMARY KEY ("id")
            )
        `);

        // Create index on type and isActive if it doesn't exist
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_rules_type_isActive" ON "rules" ("type", "isActive")`);

        // Create rule_fields table if it doesn't exist
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "rule_fields" (
                "id" SERIAL NOT NULL,
                "name" character varying(255) NOT NULL,
                "type" character varying(50) NOT NULL,
                "label" character varying(255) NOT NULL,
                "description" text,
                "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_rule_fields" PRIMARY KEY ("id"),
                CONSTRAINT "UQ_rule_fields_name" UNIQUE ("name")
            )
        `);

        // Create index on name if it doesn't exist
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_rule_fields_name" ON "rule_fields" ("name")`);

        // Create rule_releases junction table (for policies) if it doesn't exist
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "rule_releases" (
                "id" SERIAL NOT NULL,
                "rule_id" uuid NOT NULL,
                "release_catalog_id" character varying NOT NULL,
                "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_rule_releases" PRIMARY KEY ("id"),
                CONSTRAINT "FK_rule_releases_rule" FOREIGN KEY ("rule_id") REFERENCES "rules"("id") ON DELETE CASCADE ON UPDATE NO ACTION,
                CONSTRAINT "FK_rule_releases_release" FOREIGN KEY ("release_catalog_id") REFERENCES "release"("catalog_id") ON DELETE CASCADE ON UPDATE NO ACTION
            )
        `);

        // Create unique index on rule_releases if it doesn't exist
        await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_rule_releases_rule_release" ON "rule_releases" ("rule_id", "release_catalog_id")`);

        // Create rule_device_types junction table (for restrictions) if it doesn't exist
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "rule_device_types" (
                "id" SERIAL NOT NULL,
                "rule_id" uuid NOT NULL,
                "device_type_id" integer NOT NULL,
                "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_rule_device_types" PRIMARY KEY ("id"),
                CONSTRAINT "FK_rule_device_types_rule" FOREIGN KEY ("rule_id") REFERENCES "rules"("id") ON DELETE CASCADE ON UPDATE NO ACTION,
                CONSTRAINT "FK_rule_device_types_device_type" FOREIGN KEY ("device_type_id") REFERENCES "device_type"("id") ON DELETE CASCADE ON UPDATE NO ACTION
            )
        `);

        // Create unique index on rule_device_types if it doesn't exist
        await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_rule_device_types_rule_device_type" ON "rule_device_types" ("rule_id", "device_type_id")`);

        // Create rule_devices junction table (for restrictions) if it doesn't exist
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "rule_devices" (
                "id" SERIAL NOT NULL,
                "rule_id" uuid NOT NULL,
                "device_id" character varying NOT NULL,
                "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_rule_devices" PRIMARY KEY ("id"),
                CONSTRAINT "FK_rule_devices_rule" FOREIGN KEY ("rule_id") REFERENCES "rules"("id") ON DELETE CASCADE ON UPDATE NO ACTION,
                CONSTRAINT "FK_rule_devices_device" FOREIGN KEY ("device_id") REFERENCES "device"("ID") ON DELETE CASCADE ON UPDATE NO ACTION
            )
        `);

        // Create unique index on rule_devices if it doesn't exist
        await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_rule_devices_rule_device" ON "rule_devices" ("rule_id", "device_id")`);

        // Create rule_os table (for restrictions) if it doesn't exist
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "rule_os" (
                "id" SERIAL NOT NULL,
                "rule_id" uuid NOT NULL,
                "osType" character varying(100) NOT NULL,
                "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_rule_os" PRIMARY KEY ("id"),
                CONSTRAINT "FK_rule_os_rule" FOREIGN KEY ("rule_id") REFERENCES "rules"("id") ON DELETE CASCADE ON UPDATE NO ACTION
            )
        `);

        // Create unique index on rule_os if it doesn't exist
        await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_rule_os_rule_osType" ON "rule_os" ("rule_id", "osType")`);

        // Insert default rule fields (using ON CONFLICT DO NOTHING to handle duplicates)
        await queryRunner.query(`
            INSERT INTO "rule_fields" ("name", "type", "label", "description") VALUES
            ('$.battery.level', 'number', 'Battery Level', 'Device battery level percentage'),
            ('$.battery.isCharging', 'boolean', 'Is Charging', 'Whether device is currently charging'),
            ('$.os.name', 'string', 'OS Name', 'Operating system name'),
            ('$.os.version', 'string', 'OS Version', 'Operating system version'),
            ('$.location.latitude', 'number', 'Latitude', 'Device location latitude'),
            ('$.location.longitude', 'number', 'Longitude', 'Device location longitude'),
            ('$.device.type', 'string', 'Device Type', 'Type of device'),
            ('$.device.any', 'boolean', 'Any Device', 'When set to true, policy evaluation will pass regardless of other conditions. Use this to display components without special checks.')
            ON CONFLICT ("name") DO NOTHING
        `);

        // Insert default "Allow All Devices" policy rule (using ON CONFLICT DO NOTHING)
        await queryRunner.query(`
            INSERT INTO "rules" ("id", "name", "description", "type", "version", "isActive", "rule")
            VALUES (
                '${DEFAULT_ALLOW_ALL_DEVICES_RULE_ID}',
                '${DEFAULT_ALLOW_ALL_DEVICES_RULE_NAME}',
                'Default policy that allows all devices to download a component. This rule is automatically applied to all existing and new releases unless manually removed.',
                'policy',
                1,
                true,
                '{"all": [{"fact": "$.device.any", "operator": "equal", "value": true}]}'::jsonb
            )
            ON CONFLICT ("id") DO NOTHING
        `);

        // Link default rule to all existing eleases (using ON CONFLICT DO NOTHING)
        await queryRunner.query(`
            INSERT INTO "rule_releases" ("rule_id", "release_catalog_id")
            SELECT '${DEFAULT_ALLOW_ALL_DEVICES_RULE_ID}', "catalog_id"
            FROM "release"
            WHERE "catalog_id" IS NOT NULL
            ON CONFLICT ("rule_id", "release_catalog_id") DO NOTHING
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop tables in reverse order
        await queryRunner.query(`DROP INDEX "public"."IDX_rule_os_rule_osType"`);
        await queryRunner.query(`DROP TABLE "rule_os"`);

        await queryRunner.query(`DROP INDEX "public"."IDX_rule_devices_rule_device"`);
        await queryRunner.query(`DROP TABLE "rule_devices"`);

        await queryRunner.query(`DROP INDEX "public"."IDX_rule_device_types_rule_device_type"`);
        await queryRunner.query(`DROP TABLE "rule_device_types"`);

        await queryRunner.query(`DROP INDEX "public"."IDX_rule_releases_rule_release"`);
        await queryRunner.query(`DROP TABLE "rule_releases"`);

        await queryRunner.query(`DROP INDEX "public"."IDX_rule_fields_name"`);
        await queryRunner.query(`DROP TABLE "rule_fields"`);

        await queryRunner.query(`DROP INDEX "public"."IDX_rules_type_isActive"`);
        await queryRunner.query(`DROP TABLE "rules"`);

        await queryRunner.query(`DROP TYPE "public"."rule_type_enum"`);
    }
}
