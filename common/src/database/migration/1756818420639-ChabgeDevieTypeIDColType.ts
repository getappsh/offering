import { MigrationInterface, QueryRunner } from "typeorm";

export class ChabgeDevieTypeIDColType1756818420639 implements MigrationInterface {
    name = 'ChabgeDevieTypeIDColType1756818420639'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1️⃣ Drop foreign keys & index
        await queryRunner.query(`ALTER TABLE "device_device_types" DROP CONSTRAINT "FK_c57b3ee1596e9a00008da082ba1"`);
        await queryRunner.query(`ALTER TABLE "platform_device_type" DROP CONSTRAINT "FK_86a2e27320d8434d971ea976a5e"`);
        await queryRunner.query(`ALTER TABLE "device_type_project" DROP CONSTRAINT "FK_459a69eb47cc1ab5f664822af0e"`);
        await queryRunner.query(`ALTER TABLE "offering_tree_policy" DROP CONSTRAINT "FK_7affc26f7561a1329f6da0c9ec1"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_08b61b07472247dc03568280b8"`);

        // 2️⃣ Prepare for ID change
        await queryRunner.query(`ALTER TABLE "device_type" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE IF EXISTS "device_type_id_seq"`);
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto`);

        // 3️⃣ Add temporary column to keep old IDs
        await queryRunner.query(`ALTER TABLE "device_type" ADD COLUMN "old_id" bigint`);
        await queryRunner.query(`UPDATE "device_type" SET old_id = id`);

        // 4️⃣ Update device_type.id with new hashed values
        await queryRunner.query(`UPDATE "device_type" SET id = (((('x' || substr(encode(digest(name::text, 'sha256'), 'hex'), 1, 8))::bit(32)::bigint) & 4294967295) % 100000000)`);

        // 5️⃣ Update all child tables to new IDs
        await queryRunner.query(`UPDATE "device_type_project" dtp SET device_type_id = dt.id FROM "device_type" dt WHERE dtp.device_type_id = dt.old_id`);
        await queryRunner.query(`UPDATE "platform_device_type" pdt SET device_type_id = dt.id FROM "device_type" dt WHERE pdt.device_type_id = dt.old_id`);
        await queryRunner.query(`UPDATE "device_device_types" ddt SET device_type_id = dt.id FROM "device_type" dt WHERE ddt.device_type_id = dt.old_id`);
        await queryRunner.query(`UPDATE "offering_tree_policy" otp SET device_type_id = dt.id FROM "device_type" dt WHERE otp.device_type_id = dt.old_id`);

        // 6️⃣ Drop temporary column
        await queryRunner.query(`ALTER TABLE "device_type" DROP COLUMN "old_id"`);

        // 7️⃣ Recreate indexes
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_08b61b07472247dc03568280b8" ON "offering_tree_policy" ("platform_id", "device_type_id", "project_id")`);

        // 8️⃣ Recreate foreign keys
        await queryRunner.query(`ALTER TABLE "offering_tree_policy" ADD CONSTRAINT "FK_7affc26f7561a1329f6da0c9ec1" FOREIGN KEY ("device_type_id") REFERENCES "device_type"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "device_type_project" ADD CONSTRAINT "FK_459a69eb47cc1ab5f664822af0e" FOREIGN KEY ("device_type_id") REFERENCES "device_type"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "platform_device_type" ADD CONSTRAINT "FK_86a2e27320d8434d971ea976a5e" FOREIGN KEY ("device_type_id") REFERENCES "device_type"("id") ON DELETE NO ACTION ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "device_device_types" ADD CONSTRAINT "FK_c57b3ee1596e9a00008da082ba1" FOREIGN KEY ("device_type_id") REFERENCES "device_type"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }


    public async down(queryRunner: QueryRunner): Promise<void> {
        // 1️⃣ Drop foreign keys & index
        await queryRunner.query(`ALTER TABLE "device_device_types" DROP CONSTRAINT "FK_c57b3ee1596e9a00008da082ba1"`);
        await queryRunner.query(`ALTER TABLE "platform_device_type" DROP CONSTRAINT "FK_86a2e27320d8434d971ea976a5e"`);
        await queryRunner.query(`ALTER TABLE "device_type_project" DROP CONSTRAINT "FK_459a69eb47cc1ab5f664822af0e"`);
        await queryRunner.query(`ALTER TABLE "offering_tree_policy" DROP CONSTRAINT "FK_7affc26f7561a1329f6da0c9ec1"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_08b61b07472247dc03568280b8"`);

        // 2️⃣ Add temporary column to keep old hashed IDs
        await queryRunner.query(`ALTER TABLE "device_type" ADD COLUMN "old_id" bigint`);
        await queryRunner.query(`UPDATE "device_type" SET old_id = id`);

        // 3️⃣ Reset device_type.id with new auto-increment values
        await queryRunner.query(`DROP SEQUENCE IF EXISTS "device_type_id_seq"`);
        await queryRunner.query(`CREATE SEQUENCE "device_type_id_seq" START 1`);
        await queryRunner.query(`WITH cte AS (SELECT id AS old_id, ROW_NUMBER() OVER (ORDER BY old_id) AS rn FROM "device_type") UPDATE "device_type" dt SET id = cte.rn FROM cte WHERE dt.id = cte.old_id`);

        // 4️⃣ Update sequence to match max ID
        await queryRunner.query(`SELECT setval('device_type_id_seq', (SELECT MAX(id) FROM "device_type"))`);

        // 5️⃣ Update all child tables to new IDs
        await queryRunner.query(`UPDATE "device_type_project" dtp SET device_type_id = dt.id FROM "device_type" dt WHERE dtp.device_type_id = dt.old_id`);
        await queryRunner.query(`UPDATE "platform_device_type" pdt SET device_type_id = dt.id FROM "device_type" dt WHERE pdt.device_type_id = dt.old_id`);
        await queryRunner.query(`UPDATE "device_device_types" ddt SET device_type_id = dt.id FROM "device_type" dt WHERE ddt.device_type_id = dt.old_id`);
        await queryRunner.query(`UPDATE "offering_tree_policy" otp SET device_type_id = dt.id FROM "device_type" dt WHERE otp.device_type_id = dt.old_id`);

        // 6️⃣ Drop temporary column
        await queryRunner.query(`ALTER TABLE "device_type" DROP COLUMN "old_id"`);

        // 7️⃣ Recreate indexes
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_08b61b07472247dc03568280b8" ON "offering_tree_policy" ("platform_id", "device_type_id", "project_id")`);

        // 8️⃣ Recreate foreign keys
        await queryRunner.query(`ALTER TABLE "offering_tree_policy" ADD CONSTRAINT "FK_7affc26f7561a1329f6da0c9ec1" FOREIGN KEY ("device_type_id") REFERENCES "device_type"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "device_type_project" ADD CONSTRAINT "FK_459a69eb47cc1ab5f664822af0e" FOREIGN KEY ("device_type_id") REFERENCES "device_type"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "platform_device_type" ADD CONSTRAINT "FK_86a2e27320d8434d971ea976a5e" FOREIGN KEY ("device_type_id") REFERENCES "device_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "device_device_types" ADD CONSTRAINT "FK_c57b3ee1596e9a00008da082ba1" FOREIGN KEY ("device_type_id") REFERENCES "device_type"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }


}
