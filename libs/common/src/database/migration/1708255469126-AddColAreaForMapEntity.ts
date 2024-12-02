import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColAreaForMapEntity1708255469126 implements MigrationInterface {
    name = 'AddColAreaForMapEntity1708255469126'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "map" ADD "area" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "map" DROP COLUMN "area"`);
    }

}
