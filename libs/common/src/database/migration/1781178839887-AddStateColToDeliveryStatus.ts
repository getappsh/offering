import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStateColToDeliveryStatus1781178839887 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."delivery_status_state_enum" AS ENUM('Prepare', 'Download', 'Validation', 'Done')`);
        await queryRunner.query(`ALTER TABLE "delivery_status" ADD "state" "public"."delivery_status_state_enum" NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "delivery_status" DROP COLUMN "state"`);
        await queryRunner.query(`DROP TYPE "public"."delivery_status_state_enum"`);
    }

}
