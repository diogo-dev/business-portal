import { MigrationInterface, QueryRunner } from "typeorm";

export class CorrectUserCommentRelatioship1771689748797 implements MigrationInterface {
    name = 'CorrectUserCommentRelatioship1771689748797'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post_comment" DROP CONSTRAINT "FK_a8a5a8cd757122e162e86d78d39"`);
        await queryRunner.query(`ALTER TABLE "post_comment" DROP CONSTRAINT "REL_a8a5a8cd757122e162e86d78d3"`);
        await queryRunner.query(`ALTER TABLE "post_comment" ADD CONSTRAINT "FK_a8a5a8cd757122e162e86d78d39" FOREIGN KEY ("authorId") REFERENCES "user_account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post_comment" DROP CONSTRAINT "FK_a8a5a8cd757122e162e86d78d39"`);
        await queryRunner.query(`ALTER TABLE "post_comment" ADD CONSTRAINT "REL_a8a5a8cd757122e162e86d78d3" UNIQUE ("authorId")`);
        await queryRunner.query(`ALTER TABLE "post_comment" ADD CONSTRAINT "FK_a8a5a8cd757122e162e86d78d39" FOREIGN KEY ("authorId") REFERENCES "user_account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
