import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { PostCommentService } from './post-comment.service';
import { CreatePostCommentDto } from './dto/create-post-comment.dto';
import { UpdatePostCommentDto } from './dto/update-post-comment.dto';
import type { UUID } from 'crypto';
import { Public } from 'src/decorators/public.decorator';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('post-comment')
export class PostCommentController {
  constructor(private readonly postCommentService: PostCommentService) {}

  @Post()
  @Roles('admin', 'user')
  create(@Body() createPostCommentDto: CreatePostCommentDto) {
    return this.postCommentService.create(createPostCommentDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.postCommentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: UUID) {
    return this.postCommentService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin')
  update(@Param('id', ParseUUIDPipe) id: UUID, @Body() updatePostCommentDto: UpdatePostCommentDto) {
    return this.postCommentService.update(id, updatePostCommentDto);
  }

  @Delete(':id')
  @Roles('admin', 'user')
  remove(@Param('id', ParseUUIDPipe) id: UUID) {
    return this.postCommentService.remove(id);
  }
}
