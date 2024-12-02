import { MigrationInterface, QueryRunner } from "typeorm";

export class AddExpiredDateCol1706798324389 implements MigrationInterface {
    name = 'AddExpiredDateCol1706798324389'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "map" ADD "expired_date" TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "map" DROP COLUMN "expired_date"`);
    }

}
