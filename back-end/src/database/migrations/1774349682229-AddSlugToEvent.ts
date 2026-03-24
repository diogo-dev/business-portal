import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSlugToEvent1774349682229 implements MigrationInterface {
    name = 'AddSlugToEvent1774349682229'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event" ADD "slug" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "event" ADD CONSTRAINT "UQ_9d0d870657c4fac264cdca048e8" UNIQUE ("slug")`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_9d0d870657c4fac264cdca048e" ON "event" ("slug") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_9d0d870657c4fac264cdca048e"`);
        await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "UQ_9d0d870657c4fac264cdca048e8"`);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "slug"`);
    }

}
    