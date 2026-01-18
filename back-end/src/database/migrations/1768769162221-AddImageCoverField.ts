import { MigrationInterface, QueryRunner } from "typeorm";

export class AddImageCoverField1768769162221 implements MigrationInterface {
    name = 'AddImageCoverField1768769162221'

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`
            ALTER TABLE "user_roles" DROP CONSTRAINT "FK_user_roles_userAccountId";
        `);

        await queryRunner.query(`
            ALTER TABLE "user_roles" DROP CONSTRAINT "FK_user_roles_roleId";
        `);

        await queryRunner.query(`
            ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_role_permissions_roleId";
        `);

        await queryRunner.query(`
            ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_role_permissions_permissionId";
        `);

        await queryRunner.query(`
            DROP INDEX "public"."IDX_user_roles_userAccountId";
        `);

        await queryRunner.query(`
            DROP INDEX "public"."IDX_user_roles_roleId";
        `);

        await queryRunner.query(`
            DROP INDEX "public"."IDX_role_permissions_roleId";
        `);

        await queryRunner.query(`
            DROP INDEX "public"."IDX_role_permissions_permissionId";
        `);

        await queryRunner.query(`
            ALTER TABLE "permission" DROP CONSTRAINT "CHK_permission_action";
        `);

        await queryRunner.query(`
            ALTER TABLE "event" ADD "cover_image_url" character varying;
        `);

        await queryRunner.query(`
            ALTER TABLE "post" ADD "cover_image_url" character varying;
        `);

        await queryRunner.query(`
            CREATE INDEX "IDX_user_roles_userAccountId" ON "user_roles" ("userAccountId");
        `);

        await queryRunner.query(`
            CREATE INDEX "IDX_user_roles_roleId" ON "user_roles" ("roleId");
        `);

        await queryRunner.query(`
            CREATE INDEX "IDX_role_permissions_roleId" ON "role_permissions" ("roleId");
        `);

        await queryRunner.query(`
            CREATE INDEX "IDX_role_permissions_permissionId" ON "role_permissions" ("permissionId");
        `);

        await queryRunner.query(`
            ALTER TABLE "permission" ADD CONSTRAINT "CHK_permission_action" CHECK ("action" IN ('create', 'read', 'update', 'delete', 'comment'));
        `);

        await queryRunner.query(`
            ALTER TABLE "user_roles" ADD CONSTRAINT "FK_user_roles_userAccountId" FOREIGN KEY ("userAccountId") REFERENCES "user_account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
        `);

        await queryRunner.query(`
            ALTER TABLE "user_roles" ADD CONSTRAINT "FK_user_roles_roleId" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
        `);

        await queryRunner.query(`
            ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_role_permissions_roleId" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE;
        `);

        await queryRunner.query(`
            ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_role_permissions_permissionId" FOREIGN KEY ("permissionId") REFERENCES "permission"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`
            ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_role_permissions_permissionId";
        `);

        await queryRunner.query(`
            ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_role_permissions_roleId";
        `);

        await queryRunner.query(`
            ALTER TABLE "user_roles" DROP CONSTRAINT "FK_user_roles_roleId";
        `);

        await queryRunner.query(`
            ALTER TABLE "user_roles" DROP CONSTRAINT "FK_user_roles_userAccountId";
        `);

        await queryRunner.query(`
            ALTER TABLE "permission" DROP CONSTRAINT "CHK_permission_action";
        `);

        await queryRunner.query(`
            DROP INDEX "public"."IDX_role_permissions_permissionId";
        `);

        await queryRunner.query(`
            DROP INDEX "public"."IDX_role_permissions_roleId";
        `);

        await queryRunner.query(`
            DROP INDEX "public"."IDX_user_roles_roleId";
        `);

        await queryRunner.query(`
            DROP INDEX "public"."IDX_user_roles_userAccountId";
        `);

        await queryRunner.query(`
            ALTER TABLE "post" DROP COLUMN "cover_image_url";
        `);

        await queryRunner.query(`
            ALTER TABLE "event" DROP COLUMN "cover_image_url";
        `);

        await queryRunner.query(`
            ALTER TABLE "permission" ADD CONSTRAINT "CHK_permission_action" CHECK (((action)::text = ANY ((ARRAY['create'::character varying, 'read'::character varying, 'update'::character varying, 'delete'::character varying, 'comment'::character varying])::text[])));
        `);

        await queryRunner.query(`
            CREATE INDEX "IDX_role_permissions_permissionId" ON "role_permissions" ("permissionId");
        `);

        await queryRunner.query(`
            CREATE INDEX "IDX_role_permissions_roleId" ON "role_permissions" ("roleId");
        `);

        await queryRunner.query(`
            CREATE INDEX "IDX_user_roles_roleId" ON "user_roles" ("roleId");
        `);

        await queryRunner.query(`
            CREATE INDEX "IDX_user_roles_userAccountId" ON "user_roles" ("userAccountId");
        `);

        await queryRunner.query(`
            ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_role_permissions_permissionId" FOREIGN KEY ("permissionId") REFERENCES "permission"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
        `);

        await queryRunner.query(`
            ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_role_permissions_roleId" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE;
        `);

        await queryRunner.query(`
            ALTER TABLE "user_roles" ADD CONSTRAINT "FK_user_roles_roleId" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
        `);

        await queryRunner.query(`
            ALTER TABLE "user_roles" ADD CONSTRAINT "FK_user_roles_userAccountId" FOREIGN KEY ("userAccountId") REFERENCES "user_account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
        `);
    }

}
