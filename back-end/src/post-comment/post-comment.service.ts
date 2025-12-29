import { Injectable } from '@nestjs/common';
import { CreatePostCommentDto } from './dto/create-post-comment.dto';
import { UpdatePostCommentDto } from './dto/update-post-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PostComment } from './entities/post-comment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostCommentService {

  constructor(@InjectRepository(PostComment) private readonly postCommentRepository: Repository<PostComment>) {}

  async create(createPostCommentDto: CreatePostCommentDto): Promise<PostComment> {
    const comment = this.postCommentRepository.create(createPostCommentDto);
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
    return await this.postCommentRepository.findOneOrFail({ where: { id }, relations: ['author', 'post'] });
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
