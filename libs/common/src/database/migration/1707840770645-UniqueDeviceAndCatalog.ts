import { MigrationInterface, QueryRunner } from "typeorm";

export class UniqueDeviceAndCatalog1707840770645 implements MigrationInterface {
    name = 'UniqueDeviceAndCatalog1707840770645'

    public async up(queryRunner: QueryRunner): Promise<void> {
         await queryRunner.query(`
            DELETE FROM public.delivery_status
            WHERE id NOT IN (
                SELECT id FROM (
                    SELECT "deviceID", "catalogId","current_time", id,
                      ROW_NUMBER() OVER (PARTITION BY "deviceID", "catalogId" ORDER BY "current_time" DESC) AS row_num FROM
                      delivery_status ) AS ranked where row_num = 1
            )
        `);
        await queryRunner.query(`ALTER TABLE "delivery_status" ADD CONSTRAINT "UQ_deviceID_catalogId" UNIQUE ("deviceID", "catalogId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "delivery_status" DROP CONSTRAINT "UQ_deviceID_catalogId"`);

    }

}
