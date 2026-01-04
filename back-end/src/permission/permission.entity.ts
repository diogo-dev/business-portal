import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, Check } from "typeorm";
import { Role } from "src/role/role.entity";

@Entity()
export class Permission {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true, length: 50 })
    name: string; // ex: 'posts:create', 'posts:delete', 'events:update'

    @Column({ nullable: true, length: 255 })
    description: string;

    @Column({ nullable: true, length: 20 })
    resource: string; // ex: 'posts', 'events', 'users'

    @Column({ nullable: true, length: 20 })
    @Check(`"action" IN ('create', 'read', 'update', 'delete', 'comment')`)
    action: string; // ex: 'create', 'read', 'update', 'delete'

    @ManyToMany(() => Role, role => role.permissions)
    roles: Role[];
}