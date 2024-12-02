import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateMapDateColWithTimeZone1707646371724 implements MigrationInterface {
    name = 'UpdateMapDateColWithTimeZone1707646371724'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "map" RENAME COLUMN "lastUpdatedDate" TO "last_update_date" `);
        await queryRunner.query(`ALTER TABLE "map" ALTER COLUMN "create_date" TYPE TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER SEQUENCE "map_product_new_id_seq" RENAME TO "map_product_pk_id_seq"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER SEQUENCE "map_product_pk_id_seq" RENAME TO "map_product_new_id_seq"`);
        await queryRunner.query(`ALTER TABLE "map" ALTER COLUMN "create_date" TYPE TIMESTAMP WITHOUT TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "map" RENAME COLUMN "last_update_date" TO "lastUpdatedDate" `);
    }

}
