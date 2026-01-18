import { UserAccount } from "src/user-account/entities/user-account.entity";
import { Entity, Column,  PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { PostStatus } from "../enum/post-status.enum";
import { PostComment } from "src/post-comment/entities/post-comment.entity";

@Entity()
export class Post {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column()
    content: string;

    @Column({ nullable: true })
    summary: string;

    @Column({ type: 'enum', enum: PostStatus, default: PostStatus.DRAFT})
    status: PostStatus;

    @Column({ name: 'cover_image_url', nullable: true })
    coverImageUrl: string;

    @Column({ type: 'timestamptz', name: 'published_at', nullable: true })
    publishedAt: Date;

    @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
    createdAt: Date;
    
    @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
    updatedAt: Date;

    @OneToMany(() => PostComment, comment => comment.post)
    comments: PostComment[];

    @ManyToOne(() => UserAccount, author => author.posts, {nullable: true, onDelete: 'SET NULL'})
    author: UserAccount;
}
