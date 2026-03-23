import { BadRequestException, Body, Controller, Get, Patch, Post, Request, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from 'src/user-account/dto/sign-in.dto';
import { CreateUserAccountDto } from 'src/user-account/dto/create-user-account.dto';
import { UpdateUserAccountDto } from 'src/user-account/dto/update-user-account.dto';
import { Public } from 'src/decorators/public.decorator';
import { UploadService } from 'src/upload/upload.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private uploadService: UploadService
    ) {}

    @Public()
    @Post('login')
    signIn(@Body() signInDto: SignInDto) {
        return this.authService.signIn(signInDto);
    }

    @Public()
    @Post('register')
    signUp(@Body() signUpDto: CreateUserAccountDto) {
        return this.authService.signUp(signUpDto);
    }

    @Get('me')
    getProfile(@Request() req) {
        return this.authService.getProfile(req.user.sub);
    }

    @Patch('me')
    @UseInterceptors(FileInterceptor('file', {
        limits: { fileSize: 2 * 1024 * 1024 }, 
        fileFilter: (req, file, callback) => {
            if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
                return callback(new BadRequestException('Only image files are allowed!'), false);
            }
            callback(null, true);
        }   
    }))
    async updateProfile(
      @Request() req, 
      @Body() body: any,
      @UploadedFile() file: Express.Multer.File
    ) {

      const updateProfileDto: UpdateUserAccountDto = {
        profile: typeof body.profile === 'string' 
        ? JSON.parse(body.profile) 
        : body.profile
      };

      if (file) {
        if (updateProfileDto.profile?.avatarUrl) {
          await this.uploadService.deleteImage(updateProfileDto.profile.avatarUrl);
        }

        updateProfileDto.profile!.avatarUrl = await this.uploadService.uploadImage(file.originalname, file.buffer);
      }

      return this.authService.updateProfile(req.user.sub, updateProfileDto);
    }

}
