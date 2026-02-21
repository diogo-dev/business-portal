import { Event } from "src/event/entities/event.entity";
import { Post } from "src/post/entities/post.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import bcrypt from "bcrypt";
import { Exclude } from "class-transformer";
import { Role } from "src/role/role.entity";
import { Profile } from "./profile.entity";
import { PostComment } from "src/post-comment/entities/post-comment.entity";

@Entity()
export class UserAccount {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Exclude()
    @Column({ name: 'password_hash' })
    passwordHash: string;

    @Column({ name: 'user_name' })
    userName: string;

    @OneToMany(() => Post, post => post.author)
    posts: Post[]

    @OneToMany(() => PostComment, (comment) => comment.author)
    comments: PostComment[];

    @OneToMany(() => Event, event => event.creator)
    events: Event[]

    @ManyToMany(() => Role, role => role.users, { eager: true })
    @JoinTable({
        name: 'user_roles'
    })
    roles: Role[]

    @OneToOne(() => Profile, profile => profile.user, { cascade: true})
    @JoinColumn({name: 'profile_id'})
    profile: Profile;

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
    if (this.passwordHash && !this.passwordHash.startsWith('$2')) { // evita double-hash
        const salt = await bcrypt.genSalt(10);
        this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    }
}
}
