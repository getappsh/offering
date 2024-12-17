import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateMapImportStatusEnum1700640402502 implements MigrationInterface {
    name = 'UpdateMapImportStatusEnum1700640402502'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."map_status_enum" RENAME TO "map_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."map_status_enum" AS ENUM('Start', 'InProgress', 'Done', 'Cancel', 'Pause', 'Error', 'Pending', 'Expired', 'Archived')`);
        await queryRunner.query(`ALTER TABLE "map" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "map" ALTER COLUMN "status" TYPE "public"."map_status_enum" USING "status"::"text"::"public"."map_status_enum"`);
        await queryRunner.query(`ALTER TABLE "map" ALTER COLUMN "status" SET DEFAULT 'Start'`);
        await queryRunner.query(`DROP TYPE "public"."map_status_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."map_status_enum_old" AS ENUM('Start', 'InProgress', 'Done', 'Cancel', 'Error')`);
        await queryRunner.query(`ALTER TABLE "map" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "map" ALTER COLUMN "status" TYPE "public"."map_status_enum_old" USING "status"::"text"::"public"."map_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "map" ALTER COLUMN "status" SET DEFAULT 'Start'`);
        await queryRunner.query(`DROP TYPE "public"."map_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."map_status_enum_old" RENAME TO "map_status_enum"`);
    }

}
