import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRegulationCountToRelease1737470881487 implements MigrationInterface {
    name = 'AddRegulationCountToRelease1737470881487'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "release" ADD "required_regulations_count" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "release" ADD "compliant_regulations_count" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "release" DROP COLUMN "compliant_regulations_count"`);
        await queryRunner.query(`ALTER TABLE "release" DROP COLUMN "required_regulations_count"`);
    }

}
