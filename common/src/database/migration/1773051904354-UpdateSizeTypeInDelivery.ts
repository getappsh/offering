import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateSizeTypeInDelivery1773051904354 implements MigrationInterface {
    name = 'UpdateSizeTypeInDelivery1773051904354'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "delivery" ALTER COLUMN "size" TYPE bigint`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`UPDATE "delivery" SET "size" = NULL WHERE "size" > ${2_147_483_647}`);
        await queryRunner.query(`ALTER TABLE "delivery" ALTER COLUMN "size" TYPE integer USING "size"::integer`);
    }

}
