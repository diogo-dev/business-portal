import { RoleService } from "src/role/role.service";
import { CreateUserAccountDto } from "src/user-account/dto/create-user-account.dto";
import { UserAccountService } from "src/user-account/user-account.service";


export default async function seedUsers(userAccountService: UserAccountService, roleService: RoleService) {

    // Check if users already exist
    const existingUsersCount = await userAccountService.count();
    if (existingUsersCount > 0) {
        console.log('Seed: Users already exist, skipping user seeding');
        return;
    }

    // Fetch roles to assign to users
    const adminRole = await roleService.findByName('admin');
    const userRole = await roleService.findByName('user');

    if (!adminRole || !userRole) {
        console.error('Seed: Required roles not found. Ensure roles are seeded before users.');
        return;
    }

    // Create users
    const usersData = [
        {
            email: 'admin@example.com',
            passwordHash: '123456',
            phone: '5544999999001',
            userName: 'admin',
            roleNames: ['admin']
        },
        {
            email: 'user@example.com',
            passwordHash: '123456',
            phone: '5544999999003',
            userName: 'user'
        }
    ];

    for (const user of usersData) {
        try {
            await userAccountService.create(user as CreateUserAccountDto);
            console.log(`Seed: Created user '${user.userName}'`);
        } catch (error) {
            console.error(`Seed: Failed to create user '${user.userName}':`, error);
        }
    }

}