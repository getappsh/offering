import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSignatureToDeliveryItem1756200663009 implements MigrationInterface {
    name = 'AddSignatureToDeliveryItem1756200663009'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "delivery_item" ADD "signature" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "delivery_item" DROP COLUMN "signature"`);
    }

}
