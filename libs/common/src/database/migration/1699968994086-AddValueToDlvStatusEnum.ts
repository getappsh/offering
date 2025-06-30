import { MigrationInterface, QueryRunner } from "typeorm";

export class AddValueToDlvStatusEnum1699968994086 implements MigrationInterface {
    name = 'AddValueToDlvStatusEnum1699968994086'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."delivery_status_delivery_status_enum" RENAME TO "delivery_status_delivery_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."delivery_status_delivery_status_enum" AS ENUM('Start', 'Done', 'Error', 'Cancelled', 'Pause', 'Continue', 'Download', 'Deleted')`);
        await queryRunner.query(`ALTER TABLE "delivery_status" ALTER COLUMN "delivery_status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "delivery_status" ALTER COLUMN "delivery_status" TYPE "public"."delivery_status_delivery_status_enum" USING "delivery_status"::"text"::"public"."delivery_status_delivery_status_enum"`);
        await queryRunner.query(`ALTER TABLE "delivery_status" ALTER COLUMN "delivery_status" SET DEFAULT 'Start'`);
        await queryRunner.query(`DROP TYPE "public"."delivery_status_delivery_status_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."delivery_status_delivery_status_enum_old" AS ENUM('Start', 'Done', 'Error', 'Cancelled', 'Pause', 'Continue', 'Download')`);
        await queryRunner.query(`ALTER TABLE "delivery_status" ALTER COLUMN "delivery_status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "delivery_status" ALTER COLUMN "delivery_status" TYPE "public"."delivery_status_delivery_status_enum_old" USING "delivery_status"::"text"::"public"."delivery_status_delivery_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "delivery_status" ALTER COLUMN "delivery_status" SET DEFAULT 'Start'`);
        await queryRunner.query(`DROP TYPE "public"."delivery_status_delivery_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."delivery_status_delivery_status_enum_old" RENAME TO "delivery_status_delivery_status_enum"`);
    }

}
