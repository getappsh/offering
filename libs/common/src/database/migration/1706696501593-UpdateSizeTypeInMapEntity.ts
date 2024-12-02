import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateSizeTypeInMapEntity1706696501593 implements MigrationInterface {
    name = 'UpdateSizeTypeInMapEntity1706696501593'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "map" ALTER COLUMN "size" TYPE bigint`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "map" ALTER COLUMN "size" TYPE integer`);
    }

}
