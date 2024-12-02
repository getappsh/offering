import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNameAndLastConnectToDeviceEntity1707756781566 implements MigrationInterface {
    name = 'AddNameAndLastConnectToDeviceEntity1707756781566'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "device" RENAME COLUMN "createdDate" TO "create_date" `);
        await queryRunner.query(`ALTER TABLE "device" RENAME COLUMN "lastUpdatedDate" TO "last_update_date" `);

        await queryRunner.query(`ALTER TABLE "device" ALTER COLUMN "create_date" TYPE TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "device" ALTER COLUMN "last_update_date" TYPE TIMESTAMP WITH TIME ZONE`);

        await queryRunner.query(`ALTER TABLE "device" ADD "last_connection_date" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "device" ADD "name" character varying`);

        await queryRunner.query(`ALTER TABLE "map" ALTER COLUMN "last_update_date" TYPE TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "map" ALTER COLUMN "last_update_date" TYPE TIMESTAMP`);

        await queryRunner.query(`ALTER TABLE "device" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "device" DROP COLUMN "last_connection_date"`);

        await queryRunner.query(`ALTER TABLE "device" ALTER COLUMN "last_update_date" TYPE TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "device" ALTER COLUMN "create_date" TYPE TIMESTAMP`);

        await queryRunner.query(`ALTER TABLE "device" RENAME COLUMN "create_date" TO "createdDate"`);
        await queryRunner.query(`ALTER TABLE "device" RENAME COLUMN "last_update_date" TO "lastUpdatedDate" `);
    }

}
