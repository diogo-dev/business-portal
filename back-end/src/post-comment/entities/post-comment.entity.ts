import { Post } from "src/post/entities/post.entity";
import { UserAccount } from "src/user-account/entities/user-account.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class PostComment {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    content: string;

    @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
    createdAt: Date;

    @OneToOne(() => UserAccount)
    @JoinColumn()
    author: UserAccount;

    @ManyToOne(() => Post, post => post.comments, {onDelete: 'CASCADE'})
    post: Post;
}
