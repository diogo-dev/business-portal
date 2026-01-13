import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostCommentDto } from './dto/create-post-comment.dto';
import { UpdatePostCommentDto } from './dto/update-post-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PostComment } from './entities/post-comment.entity';
import { EntityNotFoundError, Repository } from 'typeorm';
import { PostService } from 'src/post/post.service';
import { UserAccountService } from 'src/user-account/user-account.service';

@Injectable()
export class PostCommentService {

  constructor(
    @InjectRepository(PostComment) 
    private readonly postCommentRepository: Repository<PostComment>,
    private readonly postService: PostService,
    private readonly userAccountService: UserAccountService
  ) {}

  async create(createPostCommentDto: CreatePostCommentDto, authorId: string): Promise<PostComment> {
    // search for post
    const post = await this.postService.findOne(createPostCommentDto.postId);

    // search for author by id
    const author = await this.userAccountService.findOne(authorId);

    // create post comment with the post object
    const comment = this.postCommentRepository.create({
      content: createPostCommentDto.content,
      post: post,
      author: author
    });
    
    return await this.postCommentRepository.save(comment);
  }

  async findAll(): Promise<PostComment[]> {
    return await this.postCommentRepository.find({ relations: ['author', 'post'] });
  }

  // SELECT * FROM post_comment WHERE authorId = $1, [user_id]
  // FAZER COM QUERYBUILDER 
  async findAllCommentsByUserId(user_id: string): Promise<PostComment[]> {
    return await this.postCommentRepository.find({
      where: { author: { id: user_id } },
      relations: ['author', 'post'],
    });
  }

  async findOne(id: string): Promise<PostComment> {
    try {
      return await this.postCommentRepository.findOneOrFail({ where: { id }, relations: ['author', 'post'] });
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException(`Post comment with ID ${id} not found`);
      }
      throw error;
    }
  }

  async update(id: string, updatePostCommentDto: UpdatePostCommentDto): Promise<PostComment> {
    const comment = await this.findOne(id);
    return await this.postCommentRepository.save({ ...comment, ...updatePostCommentDto });
  }

  async remove(id: string): Promise<PostComment> {
    const comment = await this.findOne(id);
    return await this.postCommentRepository.remove(comment);
  }
}
