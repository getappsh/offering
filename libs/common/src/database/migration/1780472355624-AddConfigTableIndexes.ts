import { MigrationInterface, QueryRunner } from "typeorm";

export class AddConfigTableIndexes1780472355624 implements MigrationInterface {
    name = 'AddConfigTableIndexes1780472355624'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "IDX_48c3aa8d9eeec0e46110937442" ON "config_group" ("revision_id", "name") `);
        await queryRunner.query(`CREATE INDEX "IDX_c2a624867d8d70139454fa0a1a" ON "config_revision" ("project_id", "revision_number") `);
        await queryRunner.query(`CREATE INDEX "IDX_8432d771513f960d0c83135857" ON "config_revision" ("project_id", "status") `);
        await queryRunner.query(`CREATE INDEX "IDX_b7cf9df6dae4322e130b5a3dc8" ON "config_map_association" ("device_type_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_63aa4e2899c3c8f9fe38f2d2d0" ON "config_map_association" ("device_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_7b8349530632b4a1e13595d9b8" ON "config_map_association" ("config_map_project_id", "config_project_id") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_7b8349530632b4a1e13595d9b8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_63aa4e2899c3c8f9fe38f2d2d0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b7cf9df6dae4322e130b5a3dc8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8432d771513f960d0c83135857"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c2a624867d8d70139454fa0a1a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_48c3aa8d9eeec0e46110937442"`);
    }

}
