import { Event } from "src/event/entities/event.entity";
import { Post } from "src/post/entities/post.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import bcrypt from "bcrypt";
import { Exclude } from "class-transformer";

@Entity()
export class UserAccount {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Exclude()
    @Column({ name: 'password_hash' })
    passwordHash: string;

    @Column({ unique: true })
    phone: string;

    @Column({ name: 'user_name' })
    userName: string;

    @OneToMany(() => Post, post => post.author)
    posts: Post[]

    @OneToMany(() => Event, event => event.creator)
    events: Event[]

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
    if (this.passwordHash && !this.passwordHash.startsWith('$2')) { // evita double-hash
        const salt = await bcrypt.genSalt(10);
        this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    }
}
}
