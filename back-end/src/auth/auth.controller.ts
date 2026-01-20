import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from 'src/user-account/dto/sign-in.dto';
import { CreateUserAccountDto } from 'src/user-account/dto/create-user-account.dto';
import { Public } from 'src/decorators/public.decorator';


@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

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
}
