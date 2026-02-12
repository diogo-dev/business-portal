import { UserAccount } from "src/user-account/entities/user-account.entity";
import { Entity, Column,  PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, JoinTable, ManyToMany } from "typeorm";
import { PostStatus } from "../enum/post-status.enum";
import { PostComment } from "src/post-comment/entities/post-comment.entity";
import { Category } from "src/category/entities/category.entity";

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

    @ManyToOne(() => UserAccount, author => author.posts, {nullable: true, onDelete: 'SET NULL', eager: true })
    author: UserAccount;

    @ManyToMany(() => Category, category => category.posts, { eager: true })
    @JoinTable(
        {
            name: 'post_categories',
            joinColumn: { name: 'post_id', referencedColumnName: 'id' },
            inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' }
        }
    )
    categories: Category[];
}
