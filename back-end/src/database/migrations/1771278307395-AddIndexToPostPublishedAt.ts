import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIndexToPostPublishedAt1771278307395 implements MigrationInterface {
    name = 'AddIndexToPostPublishedAt1771278307395'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "IDX_ffe60745c834908e281ae7bb0e" ON "post" ("published_at") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_ffe60745c834908e281ae7bb0e"`);
    }

}
