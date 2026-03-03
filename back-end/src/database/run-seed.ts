import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import seedRbac from './seeds/rbac.seed';
import { PermissionService } from 'src/permission/permission.service';
import { RoleService } from 'src/role/role.service';
import { UserAccountService } from 'src/user-account/user-account.service';
import seedUsers from './seeds/users.seed';
import seedPosts from './seeds/post.seed';
import seedCategories from './seeds/category.seed';
import { PostService } from 'src/post/post.service';
import { CategoryService } from 'src/category/category.service';

async function run() {
    const app = await NestFactory.createApplicationContext(AppModule);
    try {
        const permissionService = app.get(PermissionService);
        const roleService = app.get(RoleService);
        const userAccountService = app.get(UserAccountService);
        const categoryService = app.get(CategoryService);
        const postService = app.get(PostService);
        await seedRbac(permissionService, roleService);
        await seedUsers(userAccountService, roleService);
        await seedCategories(categoryService);
        await seedPosts(postService, userAccountService);
        console.log('Seed runner finished successfully');
    } catch (err) {
        console.error('Seed runner failed', err);
        process.exitCode = 1;
    } finally {
        await app.close();
    }
}

run();
