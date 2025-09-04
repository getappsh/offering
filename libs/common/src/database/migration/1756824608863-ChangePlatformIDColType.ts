import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangePlatformIDColType1756824608863 implements MigrationInterface {
    name = 'ChangePlatformIDColType1756824608863'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "offering_tree_policy" DROP CONSTRAINT "FK_7affc26f7561a1329f6da0c9ec1"`);
        await queryRunner.query(`ALTER TABLE "platform_device_type" DROP CONSTRAINT "FK_86a2e27320d8434d971ea976a5e"`);
        await queryRunner.query(`ALTER TABLE "offering_tree_policy" DROP CONSTRAINT "FK_64361bc1fa9d5a776432e05d184"`);
        await queryRunner.query(`ALTER TABLE "platform_device_type" DROP CONSTRAINT "FK_54cf8d0f71f944b36489a5242c5"`);
        await queryRunner.query(`ALTER TABLE "device" DROP CONSTRAINT "FK_a4431527b507da2834b9cd02fc9"`);
        await queryRunner.query(`ALTER TABLE "platform" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE IF EXISTS "platform_id_seq"`);
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto`);
        await queryRunner.query(`ALTER TABLE "platform" ADD COLUMN "old_id" bigint`);
        await queryRunner.query(`UPDATE "platform" SET old_id = id`);
        await queryRunner.query(`UPDATE "platform" SET id = ((('x' || substr(encode(digest(name::text, 'sha256'), 'hex'), 1, 8))::bit(32)::bigint) & 4294967295) % 100000000`);
        await queryRunner.query(`UPDATE "device" d SET platform_id = p.id FROM "platform" p WHERE d.platform_id = p.old_id`);
        await queryRunner.query(`UPDATE "platform_device_type" pdt SET platform_id = p.id FROM "platform" p WHERE pdt.platform_id = p.old_id`);
        await queryRunner.query(`UPDATE "offering_tree_policy" otp SET platform_id = p.id FROM "platform" p WHERE otp.platform_id = p.old_id`);
        await queryRunner.query(`ALTER TABLE "platform" DROP COLUMN "old_id"`);
        await queryRunner.query(`ALTER TABLE "device" ADD CONSTRAINT "FK_a4431527b507da2834b9cd02fc9" FOREIGN KEY ("platform_id") REFERENCES "platform"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "offering_tree_policy" ADD CONSTRAINT "FK_64361bc1fa9d5a776432e05d184" FOREIGN KEY ("platform_id") REFERENCES "platform"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "offering_tree_policy" ADD CONSTRAINT "FK_7affc26f7561a1329f6da0c9ec1" FOREIGN KEY ("device_type_id") REFERENCES "device_type"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "platform_device_type" ADD CONSTRAINT "FK_54cf8d0f71f944b36489a5242c5" FOREIGN KEY ("platform_id") REFERENCES "platform"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "platform_device_type" ADD CONSTRAINT "FK_86a2e27320d8434d971ea976a5e" FOREIGN KEY ("device_type_id") REFERENCES "device_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "platform_device_type" DROP CONSTRAINT "FK_86a2e27320d8434d971ea976a5e"`);
        await queryRunner.query(`ALTER TABLE "platform_device_type" DROP CONSTRAINT "FK_54cf8d0f71f944b36489a5242c5"`);
        await queryRunner.query(`ALTER TABLE "offering_tree_policy" DROP CONSTRAINT "FK_7affc26f7561a1329f6da0c9ec1"`);
        await queryRunner.query(`ALTER TABLE "offering_tree_policy" DROP CONSTRAINT "FK_64361bc1fa9d5a776432e05d184"`);
        await queryRunner.query(`ALTER TABLE "device" DROP CONSTRAINT "FK_a4431527b507da2834b9cd02fc9"`);
        await queryRunner.query(`ALTER TABLE "platform" ADD COLUMN "old_id" bigint`);
        await queryRunner.query(`UPDATE "platform" SET old_id = id`);
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "platform_id_seq" OWNED BY "platform"."id"`);
        await queryRunner.query(`WITH cte AS (SELECT id AS old_id, ROW_NUMBER() OVER (ORDER BY old_id) AS rn FROM "platform") UPDATE "platform" p SET id = cte.rn FROM cte WHERE p.id = cte.old_id`);
        await queryRunner.query(`SELECT setval('platform_id_seq',(SELECT COALESCE(MAX(id),0) FROM "platform"))`);
        await queryRunner.query(`UPDATE "device" d SET platform_id = p.id FROM "platform" p WHERE d.platform_id = p.old_id`);
        await queryRunner.query(`UPDATE "platform_device_type" pdt SET platform_id = p.id FROM "platform" p WHERE pdt.platform_id = p.old_id`);
        await queryRunner.query(`UPDATE "offering_tree_policy" otp SET platform_id = p.id FROM "platform" p WHERE otp.platform_id = p.old_id`);
        await queryRunner.query(`ALTER TABLE "platform" DROP COLUMN "old_id"`);
        await queryRunner.query(`ALTER TABLE "device" ADD CONSTRAINT "FK_a4431527b507da2834b9cd02fc9" FOREIGN KEY ("platform_id") REFERENCES "platform"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "platform_device_type" ADD CONSTRAINT "FK_54cf8d0f71f944b36489a5242c5" FOREIGN KEY ("platform_id") REFERENCES "platform"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "offering_tree_policy" ADD CONSTRAINT "FK_64361bc1fa9d5a776432e05d184" FOREIGN KEY ("platform_id") REFERENCES "platform"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "platform_device_type" ADD CONSTRAINT "FK_86a2e27320d8434d971ea976a5e" FOREIGN KEY ("device_type_id") REFERENCES "device_type"("id") ON DELETE NO ACTION ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "offering_tree_policy" ADD CONSTRAINT "FK_7affc26f7561a1329f6da0c9ec1" FOREIGN KEY ("device_type_id") REFERENCES "device_type"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }
}
