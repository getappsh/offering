import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDeleteOptionToEnum1730820772314 implements MigrationInterface {
    name = 'AddDeleteOptionToEnum1730820772314'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."delivery_item_status_enum" RENAME TO "delivery_item_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."delivery_item_status_enum" AS ENUM('start', 'inProgress', 'done', 'error', 'delete')`);
        await queryRunner.query(`ALTER TABLE "delivery_item" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "delivery_item" ALTER COLUMN "status" TYPE "public"."delivery_item_status_enum" USING "status"::"text"::"public"."delivery_item_status_enum"`);
        await queryRunner.query(`ALTER TABLE "delivery_item" ALTER COLUMN "status" SET DEFAULT 'start'`);
        await queryRunner.query(`DROP TYPE "public"."delivery_item_status_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."delivery_status_enum" RENAME TO "delivery_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."delivery_status_enum" AS ENUM('start', 'inProgress', 'done', 'error', 'delete')`);
        await queryRunner.query(`ALTER TABLE "delivery" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "delivery" ALTER COLUMN "status" TYPE "public"."delivery_status_enum" USING "status"::"text"::"public"."delivery_status_enum"`);
        await queryRunner.query(`ALTER TABLE "delivery" ALTER COLUMN "status" SET DEFAULT 'start'`);
        await queryRunner.query(`DROP TYPE "public"."delivery_status_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`UPDATE "delivery" SET "status" = 'error', "err_msg" = COALESCE("err_msg" || '; ', '') || 'item is deleted' WHERE "status" = 'delete'`);
        await queryRunner.query(`CREATE TYPE "public"."delivery_status_enum_old" AS ENUM('start', 'inProgress', 'done', 'error')`);
        await queryRunner.query(`ALTER TABLE "delivery" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "delivery" ALTER COLUMN "status" TYPE "public"."delivery_status_enum_old" USING "status"::"text"::"public"."delivery_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "delivery" ALTER COLUMN "status" SET DEFAULT 'start'`);
        await queryRunner.query(`DROP TYPE "public"."delivery_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."delivery_status_enum_old" RENAME TO "delivery_status_enum"`);
        await queryRunner.query(`UPDATE "delivery_item" SET "status" = 'error', "err_msg" = COALESCE("err_msg" || '; ', '') || 'item is deleted' WHERE "status" = 'delete'`);
        await queryRunner.query(`CREATE TYPE "public"."delivery_item_status_enum_old" AS ENUM('start', 'inProgress', 'done', 'error')`);
        await queryRunner.query(`ALTER TABLE "delivery_item" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "delivery_item" ALTER COLUMN "status" TYPE "public"."delivery_item_status_enum_old" USING "status"::"text"::"public"."delivery_item_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "delivery_item" ALTER COLUMN "status" SET DEFAULT 'start'`);
        await queryRunner.query(`DROP TYPE "public"."delivery_item_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."delivery_item_status_enum_old" RENAME TO "delivery_item_status_enum"`);
    }

}
