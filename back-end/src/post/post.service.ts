import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Entity, EntityNotFoundError, Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { PostStatus } from './enum/post-status.enum';
import { UserAccountService } from 'src/user-account/user-account.service';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) 
    private readonly postRepository: Repository<Post>,
    private readonly userAccountService: UserAccountService
  ) {}

  async createPost(createPostDto: CreatePostDto, authorId: string) {
    // search for author by id
    const author = await this.userAccountService.findOne(authorId);

    // create post with the author object
    const post  = await this.postRepository.create({...createPostDto, author: author});

    return await this.postRepository.save(post);
  }

  // Use QueryBuilder to avoid triggering @UpdateDateColumn on publish and archive
  async publishPost(id: string): Promise<Post> {
    const post = await this.findOne(id);
      
    if (post.status === PostStatus.PUBLISHED) return post;
    if (post.status !== PostStatus.DRAFT) {
      throw new Error('Only draft posts can be published');
    }

    await this.postRepository
      .createQueryBuilder()
      .update(Post)
      .set({ 
        status: PostStatus.PUBLISHED,
        publishedAt: new Date()
      })
      .where('id = :id', { id })
      .execute();

    return this.findOne(id);
  }

  async archivePost(id: string): Promise<Post> {
    const post = await this.findOne(id);

    if (post.status === PostStatus.ARCHIVED) {
      throw new Error('Post is already archived');
    }

    await this.postRepository
      .createQueryBuilder()
      .update(Post)
      .set({ status: PostStatus.ARCHIVED })
      .where('id = :id', { id })
      .execute();

    return this.findOne(id);
  }

  async findAll(): Promise<Post[]> {
    return await this.postRepository.find();
  }

  async findTopPosts(status: PostStatus): Promise<Post[]> {
    return await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .where('post.status = :status', { status })
      .orderBy('post.createdAt', 'DESC')
      .limit(6)
      .getMany();
  }

  async findOne(id: string): Promise<Post> {
    try {
      const post = await this.postRepository.findOneOrFail({where: {id}, relations: ['comments']}) 
      return post;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException(`Post with id ${id} not found`);
      }
      throw error;
    }
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    const post = await this.findOne(id);

    if (post.status === PostStatus.ARCHIVED) {
      throw new Error('Archived posts cannot be updated');
    }

    return await this.postRepository.save({...post, ...updatePostDto});
  }

  async remove(id: string): Promise<Post> {
    const post = await this.findOne(id);
    return this.postRepository.remove(post);
  }
}
