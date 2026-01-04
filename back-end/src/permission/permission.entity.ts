import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";
import { Role } from "src/role/role.entity";

@Entity()
export class Permission {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    name: string; // ex: 'posts:create', 'posts:delete', 'events:update'

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true })
    resource: string; // ex: 'posts', 'events', 'users'

    @Column({ nullable: true })
    action: string; // ex: 'create', 'read', 'update', 'delete'

    @ManyToMany(() => Role, role => role.permissions)
    roles: Role[];
}