import { MigrationInterface, QueryRunner } from "typeorm";

export class DeviceConfigTable1722950284637 implements MigrationInterface {
    name = 'DeviceConfigTable1722950284637'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "device_config" ("id" SERIAL NOT NULL, "createdDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "lastUpdatedDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "data" json NOT NULL DEFAULT '{}'::json, "group" character varying NOT NULL, CONSTRAINT "PK_57cb6d1b1e0f26d33e2300cb7fd" PRIMARY KEY ("id"))`);
    
        // Copy data from map_configs to device_config
        await queryRunner.query(`
            INSERT INTO "device_config" ("createdDate", "lastUpdatedDate", "data", "group")
            SELECT 
                "createdDate",
                "lastUpdatedDate",
                json_build_object(
                    'delivery_timeout_mins', delivery_timeout_mins,
                    'max_map_area_sq_km', max_map_area_sq_km,
                    'max_parallel_download', max_parallel_download,
                    'download_retry_time', download_retry_time,
                    'download_timeout_mins', download_timeout_mins,
                    'inventory_job_periodic_mins', inventory_job_periodic_mins,
                    'map_conf_periodic_mins', map_conf_periodic_mins,
                    'min_space_mb', min_space_mb,
                    'max_map_size_MB', "max_map_size_MB",
                    'matomo_url', matomo_url,
                    'matomo_periodic_mins', matomo_periodic_mins,
                    'map_min_inclusion_in_percentages', map_min_inclusion_in_percentages,
                    'matomo_dimension_id', matomo_dimension_id,
                    'matomo_site_id', matomo_site_id,
                    'sd_storage_path', sd_storage_path,
                    'flash_storage_path', flash_storage_path,
                    'target_storage_policy', target_storage_policy,
                    'sd_inventory_max_size_mb', sd_inventory_max_size_mb,
                    'flash_inventory_max_size_mb', flash_inventory_max_size_mb,
                    'ortophoto_map_path', ortophoto_map_path,
                    'control_map_path', control_map_path
                ) AS "data",
                'android' AS "group"
            FROM "map_configs"
        `);

        // Drop the old map_configs table
        await queryRunner.query(`DROP TABLE "map_configs"`);
        await queryRunner.query(`DROP TYPE "public"."map_configs_target_storage_policy_enum"`);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."map_configs_target_storage_policy_enum" AS ENUM('SDOnly', 'FlashThenSD', 'SDThenFlash', 'FlashOnly')`);

        await queryRunner.query(`
            CREATE TABLE public.map_configs (
                id serial4 NOT NULL,
                "createdDate" timestamptz DEFAULT now() NOT NULL,
                "lastUpdatedDate" timestamptz DEFAULT now() NOT NULL,
                delivery_timeout_mins int4 NULL,
                max_map_area_sq_km int4 NULL,
                max_parallel_download int4 NULL,
                download_retry_time int4 NULL,
                download_timeout_mins int4 NULL,
                inventory_job_periodic_mins int4 NULL,
                map_conf_periodic_mins int4 NULL,
                min_space_mb int4 NULL,
                "max_map_size_MB" int4 NULL,
                matomo_url varchar NULL,
                matomo_periodic_mins int4 NULL,
                map_min_inclusion_in_percentages int4 NULL,
                matomo_dimension_id varchar NULL,
                matomo_site_id varchar NULL,
                sd_storage_path varchar NULL,
                flash_storage_path varchar NULL,
                target_storage_policy public.map_configs_target_storage_policy_enum DEFAULT 'SDOnly'::map_configs_target_storage_policy_enum NOT NULL,
                sd_inventory_max_size_mb int4 NULL,
                flash_inventory_max_size_mb int4 NULL,
                ortophoto_map_path varchar NULL,
                control_map_path varchar NULL,
                CONSTRAINT "PK_a5ec19b0d57a450819c28330ae9" PRIMARY KEY (id)
            )
        `);

        // Copy data back from device_config to map_configs
        await queryRunner.query(`
            INSERT INTO "map_configs" (
                "createdDate", "lastUpdatedDate", delivery_timeout_mins, max_map_area_sq_km, 
                max_parallel_download, download_retry_time, download_timeout_mins, 
                inventory_job_periodic_mins, map_conf_periodic_mins, min_space_mb, 
                "max_map_size_MB", matomo_url, matomo_periodic_mins, 
                map_min_inclusion_in_percentages, matomo_dimension_id, matomo_site_id, 
                sd_storage_path, flash_storage_path, target_storage_policy, 
                sd_inventory_max_size_mb, flash_inventory_max_size_mb, 
                ortophoto_map_path, control_map_path
            )
            SELECT 
                "createdDate", "lastUpdatedDate",
                (data->>'delivery_timeout_mins')::int4,
                (data->>'max_map_area_sq_km')::int4,
                (data->>'max_parallel_download')::int4,
                (data->>'download_retry_time')::int4,
                (data->>'download_timeout_mins')::int4,
                (data->>'inventory_job_periodic_mins')::int4,
                (data->>'map_conf_periodic_mins')::int4,
                (data->>'min_space_mb')::int4,
                (data->>'max_map_size_MB')::int4,
                data->>'matomo_url',
                (data->>'matomo_periodic_mins')::int4,
                (data->>'map_min_inclusion_in_percentages')::int4,
                data->>'matomo_dimension_id',
                data->>'matomo_site_id',
                data->>'sd_storage_path',
                data->>'flash_storage_path',
                COALESCE((data->>'target_storage_policy')::public.map_configs_target_storage_policy_enum, 'SDOnly'::public.map_configs_target_storage_policy_enum),
                (data->>'sd_inventory_max_size_mb')::int4,
                (data->>'flash_inventory_max_size_mb')::int4,
                data->>'ortophoto_map_path',
                data->>'control_map_path'
            FROM "device_config";
        `);

        // Drop the device_config table
        await queryRunner.query(`DROP TABLE "device_config"`);
    }

}
