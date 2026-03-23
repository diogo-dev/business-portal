import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPublishedAtOnEvent1774271839360 implements MigrationInterface {
    name = 'AddPublishedAtOnEvent1774271839360'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event" ADD "published_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`CREATE INDEX "IDX_3b21bb35fcf186ab9f3e836697" ON "event" ("published_at") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_3b21bb35fcf186ab9f3e836697"`);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "published_at"`);
    }

}
