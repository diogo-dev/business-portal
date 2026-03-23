import { PostStatus } from 'src/post/enum/post-status.enum';
import { UserAccount } from 'src/user-account/entities/user-account.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Index,
} from 'typeorm';

@Entity()
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ length: 500 })
  summary: string;

  @Column('text', { nullable: true })
  content: string;

  @Column()
  location: string;

  @Column({ type: 'enum', enum: PostStatus, default: PostStatus.DRAFT})
  status: PostStatus;

  @Column({ name: 'cover_image_url', nullable: true })
  coverImageUrl: string;

  @Column({ type: 'timestamptz', name: 'starts_at' })
  startsAt: Date;

  @Column({ type: 'timestamptz', name: 'ends_at' })
  endsAt: Date;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @Index()
  @Column({ type: 'timestamptz', name: 'published_at', nullable: true })
  publishedAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => UserAccount, user => user.events, {nullable: true, onDelete: 'SET NULL' })
  creator: UserAccount;
}

