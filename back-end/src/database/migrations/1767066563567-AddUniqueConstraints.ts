import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUniqueConstraints1767066563567 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user_account" ADD CONSTRAINT "UQ_user_account_email" UNIQUE ("email");
            ALTER TABLE "user_account" ADD CONSTRAINT "UQ_user_account_phone" UNIQUE ("phone");
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user_account" DROP CONSTRAINT "UQ_user_account_email";
            ALTER TABLE "user_account" DROP CONSTRAINT "UQ_user_account_phone";
        `);
    }

}
