import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPlatformAndFormationToDevice1739442371095 implements MigrationInterface {
    name = 'AddPlatformAndFormationToDevice1739442371095'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "device_platforms" ("device_ID" character varying NOT NULL, "platform_name" character varying NOT NULL, CONSTRAINT "PK_1478a0cef96a2dd95812face8ac" PRIMARY KEY ("device_ID", "platform_name"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b9de9aff18d92b708833a05f7a" ON "device_platforms" ("device_ID") `);
        await queryRunner.query(`CREATE INDEX "IDX_11403407f582b8793c9aa6e2aa" ON "device_platforms" ("platform_name") `);
        await queryRunner.query(`ALTER TABLE "device" ADD "formations" text array`);
        await queryRunner.query(`ALTER TABLE "device_platforms" ADD CONSTRAINT "FK_b9de9aff18d92b708833a05f7a6" FOREIGN KEY ("device_ID") REFERENCES "device"("ID") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "device_platforms" ADD CONSTRAINT "FK_11403407f582b8793c9aa6e2aa3" FOREIGN KEY ("platform_name") REFERENCES "platform"("name") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "device_platforms" DROP CONSTRAINT "FK_11403407f582b8793c9aa6e2aa3"`);
        await queryRunner.query(`ALTER TABLE "device_platforms" DROP CONSTRAINT "FK_b9de9aff18d92b708833a05f7a6"`);
        await queryRunner.query(`ALTER TABLE "device" DROP COLUMN "formations"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_11403407f582b8793c9aa6e2aa"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b9de9aff18d92b708833a05f7a"`);
        await queryRunner.query(`DROP TABLE "device_platforms"`);
    }

}
