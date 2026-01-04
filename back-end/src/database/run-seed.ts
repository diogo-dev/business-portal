import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import seedRbac from './seeds/rbac.seed';
import { PermissionService } from 'src/permission/permission.service';
import { RoleService } from 'src/role/role.service';
import { UserAccountService } from 'src/user-account/user-account.service';
import seedUsers from './seeds/users.seed';

async function run() {
    const app = await NestFactory.createApplicationContext(AppModule);
    try {
        const permissionService = app.get(PermissionService);
        const roleService = app.get(RoleService);
        const userAccountService = app.get(UserAccountService);
        await seedRbac(permissionService, roleService);
        await seedUsers(userAccountService, roleService);
        console.log('Seed runner finished successfully');
    } catch (err) {
        console.error('Seed runner failed', err);
        process.exitCode = 1;
    } finally {
        await app.close();
    }
}

run();
