import { MigrationInterface, QueryRunner } from "typeorm";

export class AddConfigTable1716982998632 implements MigrationInterface {
    name = 'AddConfigTable1716982998632'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "delivery_item" DROP CONSTRAINT "FK_c3a587256cfd44448bac6080f0b"`);
        await queryRunner.query(`ALTER TABLE "delivery_item" ADD CONSTRAINT "FK_c3a587256cfd44448bac6080f0b" FOREIGN KEY ("deliveryCatalogId") REFERENCES "delivery"("catalog_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`CREATE TABLE "cache_config" ("id" SERIAL NOT NULL, "createdDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "lastUpdatedDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "configs" jsonb NOT NULL, CONSTRAINT "PK_40f1780fc716b2397d5661bc8be" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "cache_config"`);
        await queryRunner.query(`ALTER TABLE "delivery_item" DROP CONSTRAINT "FK_c3a587256cfd44448bac6080f0b"`);
        await queryRunner.query(`ALTER TABLE "delivery_item" ADD CONSTRAINT "FK_c3a587256cfd44448bac6080f0b" FOREIGN KEY ("deliveryCatalogId") REFERENCES "delivery"("catalog_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
