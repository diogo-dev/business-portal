import { BadRequestException, Body, Controller, Get, Patch, Post, Request, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from 'src/user-account/dto/sign-in.dto';
import { CreateUserAccountDto } from 'src/user-account/dto/create-user-account.dto';
import { UpdateUserAccountDto } from 'src/user-account/dto/update-user-account.dto';
import { Public } from 'src/decorators/public.decorator';
import { UploadService } from 'src/upload/upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import type {} from 'multer'

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private uploadService: UploadService,
        private configService: ConfigService
    ) {}

    @Public()
    @Post('login')
    async signIn(@Body() signInDto: SignInDto, @Res({ passthrough: true }) res: Response) {
        const { access_token } = await this.authService.signIn(signInDto);

        this.setAuthCookies(res, access_token);

        return { message : 'Login successful' };
    }

    @Public()
    @Post('register')
    async signUp(@Body() signUpDto: CreateUserAccountDto, @Res({ passthrough: true }) res: Response) {
        const {access_token} = await this.authService.signUp(signUpDto);

        this.setAuthCookies(res, access_token);

        return { message : 'Registration successful' };
    }

    @Post('logout')
    async logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie('access_token');
        res.clearCookie('session_indicator');
        return { message : 'Logout successful' };
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

    private setAuthCookies(res: Response, access_token: string){
        const expires = new Date();
        expires.setSeconds(
            expires.getSeconds() + this.configService.get('JWT_EXPIRES_IN')
        );

        res.cookie('access_token', access_token, {
            httpOnly: true,
            secure: this.configService.get('NODE_ENV') === 'production',
            sameSite: this.configService.get('NODE_ENV') === 'production' ? 'none' : 'lax',
            expires
        });

        res.cookie('session_indicator', '1', {
            httpOnly: false,
            secure: this.configService.get('NODE_ENV') === 'production',
            sameSite: this.configService.get('NODE_ENV') === 'production' ? 'none' : 'lax',
            expires
        });
    }

}


