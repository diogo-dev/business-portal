import { 
    BadRequestException,
    Body, 
    Controller, 
    Delete, 
    FileTypeValidator, 
    MaxFileSizeValidator, 
    ParseFilePipe, 
    Post, 
    UploadedFile, 
    UseInterceptors 
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from 'src/decorators/public.decorator';

@Controller('upload')
export class UploadController {
    constructor(private readonly uploadService: UploadService) {}

    @Public()
    @Post()
    @UseInterceptors(FileInterceptor('file', {
        limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
        fileFilter: (req, file, callback) => {
            if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
                return callback(new BadRequestException('Only image files are allowed!'), false);
            }
            callback(null, true);
        }   
    }))
    async uploadFile(
        @UploadedFile() file: Express.Multer.File
    ): Promise<{ imageUrl: string }> {
        const imageUrl = await this.uploadService.uploadImage(file.originalname, file.buffer);
        return { imageUrl };
    }

    @Public()
    @Delete('delete')
    async deleteFile(@Body('imageUrl') imageUrl: string): Promise<{ message: string }> {
        await this.uploadService.deleteImage(imageUrl);
        return { message: 'Image deleted successfully' };
    }
}
