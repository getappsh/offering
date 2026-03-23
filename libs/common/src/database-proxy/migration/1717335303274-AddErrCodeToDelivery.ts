import { MigrationInterface, QueryRunner } from "typeorm";

export class AddErrCodeToDelivery1717335303274 implements MigrationInterface {
    name = 'AddErrCodeToDelivery1717335303274'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "delivery_item" ADD "err_code" character varying`);
        await queryRunner.query(`ALTER TABLE "delivery" ADD "err_code" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "delivery" DROP COLUMN "err_code"`);
        await queryRunner.query(`ALTER TABLE "delivery_item" DROP COLUMN "err_code"`);
    }

}
