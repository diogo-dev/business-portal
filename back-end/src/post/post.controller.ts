import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import type { UUID } from 'crypto';
import { Public } from 'src/decorators/public.decorator';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @Roles('admin')
  create(@Body() createPostDto: CreatePostDto) {
    return this.postService.createPost(createPostDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: UUID) {
    return this.postService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin')
  update(@Param('id', ParseUUIDPipe) id: UUID, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(id, updatePostDto);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id', ParseUUIDPipe) id: UUID) {
    return this.postService.remove(id);
  }

  @Patch(':id/publish')
  @Roles('admin')
  publish(@Param('id', ParseUUIDPipe) id: UUID) {
    return this.postService.publishPost(id);
  }

  @Patch(':id/archive')
  @Roles('admin')
  archive(@Param('id', ParseUUIDPipe) id: UUID) {
    return this.postService.archivePost(id);
  }
}
