import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeIdColNames1707233539307 implements MigrationInterface {
    name = 'ChangeIdColNames1707233539307'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "map_product" RENAME COLUMN "id" TO "pk_id"`);
        await queryRunner.query(`ALTER TABLE "map_product" RENAME COLUMN "p_id" TO "id"`);
    }
    
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "map_product" RENAME COLUMN "id" TO "p_id"`);
        await queryRunner.query(`ALTER TABLE "map_product" RENAME COLUMN "pk_id" TO "id"`);
    }

}
