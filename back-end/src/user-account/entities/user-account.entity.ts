import { Event } from "src/event/entities/event.entity";
import { Post } from "src/post/entities/post.entity";
import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserAccount {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    email: string;

    @Column({ name: 'password_hash' })
    passwordHash: string;

    @Column()
    phone: string;

    @Column({ name: 'user_name' })
    userName: string;

    @OneToMany(() => Post, post => post.author)
    posts: Post[]

    @OneToMany(() => Event, event => event.creator)
    events: Event[]
}
