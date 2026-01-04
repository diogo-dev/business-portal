import { MigrationInterface, QueryRunner } from "typeorm";

export class RoleAndPermissionMigration1767490025278 implements MigrationInterface {
    name = 'RoleAndPermissionMigration1767490025278'

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`
            CREATE TABLE "permission" (
                "id" uuid DEFAULT gen_random_uuid(),
                "name" varchar(50) NOT NULL,
                "description" varchar(255),
                "resource" varchar(20),
                "action" varchar(20),
                CONSTRAINT "UQ_permission_name" UNIQUE ("name"),
                CONSTRAINT "CHK_permission_action" CHECK ("action" IN ('create', 'read', 'update', 'delete', 'comment')),
                CONSTRAINT "PK_permission" PRIMARY KEY ("id")
            );
        `);

        await queryRunner.query(`
            CREATE TABLE "role" (
                "id" uuid DEFAULT gen_random_uuid(),
                "name" varchar(50) NOT NULL,
                "description" varchar(255),
                CONSTRAINT "UQ_role_name" UNIQUE ("name"),
                CONSTRAINT "PK_role" PRIMARY KEY ("id")
            );
        `);

        await queryRunner.query(`
            CREATE TABLE "user_roles" (
                "userAccountId" uuid NOT NULL,
                "roleId" uuid NOT NULL,
                CONSTRAINT "PK_user_roles" PRIMARY KEY ("userAccountId", "roleId")
            );
        `);

        await queryRunner.query(`
            CREATE INDEX "IDX_user_roles_userAccountId" ON "user_roles" ("userAccountId");
        `);

        await queryRunner.query(`
            CREATE INDEX "IDX_user_roles_roleId" ON "user_roles" ("roleId");
        `);

        await queryRunner.query(`
            CREATE TABLE "role_permissions" (
                "roleId" uuid NOT NULL,
                "permissionId" uuid NOT NULL,
                CONSTRAINT "PK_role_permissions" PRIMARY KEY ("roleId", "permissionId")
            );
        `);

        await queryRunner.query(`
            CREATE INDEX "IDX_role_permissions_roleId" ON "role_permissions" ("roleId");
        `);

        await queryRunner.query(`
            CREATE INDEX "IDX_role_permissions_permissionId" ON "role_permissions" ("permissionId");
        `);

        await queryRunner.query(`
            ALTER TABLE "post"
            ALTER COLUMN "published_at" DROP DEFAULT;
        `);

        await queryRunner.query(`
            ALTER TABLE "user_roles"
            ADD CONSTRAINT "FK_user_roles_userAccountId"
            FOREIGN KEY ("userAccountId") REFERENCES "user_account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
        `);

        await queryRunner.query(`
            ALTER TABLE "user_roles"
            ADD CONSTRAINT "FK_user_roles_roleId"
            FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
        `);

        await queryRunner.query(`
            ALTER TABLE "role_permissions"
            ADD CONSTRAINT "FK_role_permissions_roleId"
            FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE;
        `);

        await queryRunner.query(`
            ALTER TABLE "role_permissions"
            ADD CONSTRAINT "FK_role_permissions_permissionId"
            FOREIGN KEY ("permissionId") REFERENCES "permission"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
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
            ALTER TABLE "post" ALTER COLUMN "published_at" SET DEFAULT now();
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_role_permissions_permissionId";
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_role_permissions_roleId";
        `);
        await queryRunner.query(`
            DROP TABLE "role_permissions";
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_user_roles_roleId";
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_user_roles_userAccountId";
        `);
        await queryRunner.query(`
            DROP TABLE "user_roles";
        `);
        await queryRunner.query(`
            DROP TABLE "role";
        `);
        await queryRunner.query(`
            DROP TABLE "permission";
        `);
    }

}
