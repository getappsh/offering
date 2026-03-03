import { MigrationInterface, QueryRunner } from "typeorm";

export class AddHashToDeliveryItem1718702693860 implements MigrationInterface {
    name = 'AddHashToDeliveryItem1718702693860'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "delivery_item" ADD "hash" character varying`);
        await queryRunner.query(`CREATE TYPE "public"."delivery_item_hash_algorithm_enum" AS ENUM('SHA256Hex', 'SHA256Base64')`);
        await queryRunner.query(`ALTER TABLE "delivery_item" ADD "hash_algorithm" "public"."delivery_item_hash_algorithm_enum"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "delivery_item" DROP COLUMN "hash_algorithm"`);
        await queryRunner.query(`DROP TYPE "public"."delivery_item_hash_algorithm_enum"`);
        await queryRunner.query(`ALTER TABLE "delivery_item" DROP COLUMN "hash"`);
    }

}
