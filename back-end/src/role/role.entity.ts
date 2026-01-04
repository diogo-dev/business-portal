import { Permission } from "src/permission/permission.entity";
import { UserAccount } from "src/user-account/entities/user-account.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Role {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    name: string;

    @Column({ nullable: true})
    description: string;

    @ManyToMany(() => Permission, permission => permission.roles)
    @JoinTable({
        name: 'role_permissions'
    })
    permissions: Permission[]

    @ManyToMany(() => UserAccount, user => user.roles)
    users: UserAccount[]
}