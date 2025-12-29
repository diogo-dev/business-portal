import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangePhoneMigration1767035367834 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user_account"
            ALTER COLUMN "phone" TYPE varchar
            USING "phone"::varchar
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user_account"
            ALTER COLUMN "phone" TYPE integer
            USING "phone"::integer
        `);
    }
}
