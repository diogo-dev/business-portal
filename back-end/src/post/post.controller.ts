import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Request, UseInterceptors, UploadedFile, BadRequestException, Query } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import type { UUID } from 'crypto';
import { Public } from 'src/decorators/public.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from 'src/upload/upload.service';
import { PostStatus } from './enum/post-status.enum';

@Controller('post')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly uploadService: UploadService
  ) {}

  @Post()
  @Roles('admin')
  @UseInterceptors(FileInterceptor('file', {
          limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
          fileFilter: (req, file, callback) => {
              if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
                  return callback(new BadRequestException('Only image files are allowed!'), false);
              }
              callback(null, true);
          }   
      }))
  async create(
    @Body() createPostDto: CreatePostDto, 
    @Request() req,
    @UploadedFile() file: Express.Multer.File
  ) {
    if (file) {
      createPostDto.coverImageUrl = await this.uploadService.uploadImage(file.originalname, file.buffer);
    }

    return this.postService.createPost(createPostDto, req.user.sub);
  }

  @Public()
  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @Public()
  @Get('top')
  findTopPosts(@Query('status') status?: string) {
    const validStatus = status && Object.values(PostStatus).includes(status as PostStatus) 
      ? (status as PostStatus) 
      : PostStatus.PUBLISHED;
    
    return this.postService.findTopPosts(validStatus);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: UUID) {
    return this.postService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin')
  @UseInterceptors(FileInterceptor('file', {
    limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
    fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
            return callback(new BadRequestException('Only image files are allowed!'), false);
        }
        callback(null, true);
    }   
}))
  async update(
    @Param('id', ParseUUIDPipe) id: UUID, 
    @Body() updatePostDto: UpdatePostDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    if (file) {
      const currentPost = await this.postService.findOne(id);

      if (currentPost.coverImageUrl) {
        await this.uploadService.deleteImage(currentPost.coverImageUrl);
      }

      updatePostDto.coverImageUrl = await this.uploadService.uploadImage(file.originalname, file.buffer);
    }

    return this.postService.update(id, updatePostDto);
  }

  @Delete(':id')
  @Roles('admin')
  async remove(@Param('id', ParseUUIDPipe) id: UUID) {
    const post = await this.postService.findOne(id);
    
    if (post.coverImageUrl) {
      await this.uploadService.deleteImage(post.coverImageUrl);
    }

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
