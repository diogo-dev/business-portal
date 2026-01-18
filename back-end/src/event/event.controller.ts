import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Request, UseInterceptors, BadRequestException, UploadedFile } from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import type { UUID } from 'crypto';
import { Public } from 'src/decorators/public.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from 'src/upload/upload.service';


@Controller('event')
export class EventController {
  constructor(
    private readonly eventService: EventService,
    private readonly uploadService: UploadService
  ) {}

  @Post()
  @Roles('admin')
  @UseInterceptors(FileInterceptor('file', {
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
            return callback(new BadRequestException('Only image files are allowed!'), false);
        }
        callback(null, true);
    }
  }))
   async create(
    @Body() createEventDto: CreateEventDto, 
    @Request() req,
    @UploadedFile() file: Express.Multer.File
  ) {
    if (file) {
      createEventDto.coverImageUrl = await this.uploadService.uploadImage(file.originalname, file.buffer);
    }

    return this.eventService.create(createEventDto, req.user.sub);
  }

  @Public()
  @Get()
  findAll() {
    return this.eventService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: UUID) {
    return this.eventService.findOne(id);
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
    @Body() dto: UpdateEventDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    if (file) {
      const currentEvent = await this.eventService.findOne(id);

      if (currentEvent.coverImageUrl) {
        await this.uploadService.deleteImage(currentEvent.coverImageUrl);
      }

      dto.coverImageUrl = await this.uploadService.uploadImage(file.originalname, file.buffer);
    }

    return this.eventService.update(id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  async remove(@Param('id', ParseUUIDPipe) id: UUID) {
    const event = await this.eventService.findOne(id);

    if (event.coverImageUrl) {
      await this.uploadService.deleteImage(event.coverImageUrl);
    }

    return this.eventService.remove(id);
  }
}
