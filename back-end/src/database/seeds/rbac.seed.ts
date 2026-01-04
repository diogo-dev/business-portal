import { PermissionService } from 'src/permission/permission.service';
import { CreateRoleDto } from 'src/role/dto/create-role.dto';
import { RoleService } from 'src/role/role.service';

export default async function seedRbac(permissionService: PermissionService, roleService: RoleService) {

    // check if permissions data already exists
    const existingPermissions = await permissionService.count();
    if (existingPermissions > 0) {
        console.log('Seed: Permissions already exist, skipping permission seeding');
        return;
    }

    // Creating permissions
    const permissionsData = [
        // Posts
        { name: 'posts:create', resource: 'posts', action: 'create', description: 'Create posts' },
        { name: 'posts:read', resource: 'posts', action: 'read', description: 'Read posts' },
        { name: 'posts:update', resource: 'posts', action: 'update', description: 'Update posts' },
        { name: 'posts:delete', resource: 'posts', action: 'delete', description: 'Delete posts' },
        { name: 'posts:comment', resource: 'posts', action: 'comment', description: 'Comment on posts' },
        
        // Events
        { name: 'events:create', resource: 'events', action: 'create', description: 'Create events' },
        { name: 'events:read', resource: 'events', action: 'read', description: 'Read events' },
        { name: 'events:update', resource: 'events', action: 'update', description: 'Update events' },
        { name: 'events:delete', resource: 'events', action: 'delete', description: 'Delete events' },

        // Users
        { name: 'users:create', resource: 'users', action: 'create', description: 'Create users' },
        { name: 'users:read', resource: 'users', action: 'read', description: 'Read users' },
        { name: 'users:update', resource: 'users', action: 'update', description: 'Update users' },
        { name: 'users:delete', resource: 'users', action: 'delete', description: 'Delete users' },
    ];
    const permissions = await permissionService.createMany(permissionsData);
    console.log(`Seed: Created ${permissions.length} permissions`);

    // Creating roles
    const rolesToCreate = [
        {
            name: 'user',
            description: 'Default role for regular users',
            permissions: ['posts:read', 'posts:comment', 'events:read', 'users:update', 'users:read']
        },
        {
            name: 'admin',
            description: 'Administrator role with full access',
            permissions: permissions // all permissions granted to the admin 
        }
    ];

    for (const r of rolesToCreate) {
        const existingRole = await roleService.findByName(r.name);
        if (!existingRole) {
            await roleService.create({ name: r.name, description: r.description, permissions: r.permissions } as CreateRoleDto);
            console.log(`Seed: Created role '${r.name}'`);
        } else {
            console.log(`Seed: Role '${r.name}' already exists`);
        }
    }

    console.log('Seed: RBAC seeding finished');
}
