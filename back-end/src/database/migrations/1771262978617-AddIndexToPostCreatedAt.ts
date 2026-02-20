import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIndexToPostCreatedAt1771262978617 implements MigrationInterface {
    name = 'AddIndexToPostCreatedAt1771262978617'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "IDX_0f8f2f0c0512fbecbe3034b804" ON "post" ("created_at") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_0f8f2f0c0512fbecbe3034b804"`);
    }

}
