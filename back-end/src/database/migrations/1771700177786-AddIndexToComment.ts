import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIndexToComment1771700177786 implements MigrationInterface {
    name = 'AddIndexToComment1771700177786'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "IDX_2d0ea5c2aaaa92080841368f73" ON "post_comment" ("created_at") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_2d0ea5c2aaaa92080841368f73"`);
    }

}
