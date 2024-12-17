import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLastIsObsoleteCheckForMaps1705852210265 implements MigrationInterface {
    name = 'AddLastIsObsoleteCheckForMaps1705852210265'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "map" ADD "last_check is_obsolete" TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "map" DROP COLUMN "last_check is_obsolete"`);
    }

}
