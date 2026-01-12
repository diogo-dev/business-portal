import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserAccountService } from 'src/user-account/user-account.service';
import bcrypt from "bcrypt";
import { JwtService } from '@nestjs/jwt';
import { CreateUserAccountDto } from 'src/user-account/dto/create-user-account.dto';
import { SignInDto } from 'src/user-account/dto/sign-in.dto';
import { EntityNotFoundError } from 'typeorm';

@Injectable()
export class AuthService {
    constructor(
        private userAccountService: UserAccountService,
        private jwtService: JwtService
    ) {}

    async signIn(signInDto: SignInDto): Promise<{access_token: string}> {
        try {
            // search for user
            const user = await this.userAccountService.findOneByUserName(signInDto.userName);

            // verify the password
            const passwordMatches = await bcrypt.compare(signInDto.passwordHash, user.passwordHash);
            if (!passwordMatches) throw new UnauthorizedException('Invalid credentials');

            // generate the jwt
            const payload = {
                sub: user.id, 
                userName: user.userName,
                roles: user.roles
            };
            return {
                access_token: await this.jwtService.signAsync(payload)
            }
        } catch (error) {
            if (error instanceof EntityNotFoundError) {
                throw new NotFoundException(`User ${signInDto.userName} not found`);
            }
            if (error instanceof UnauthorizedException) {
                throw error;
            }
            throw error;
        }
    }

    async signUp(createUserAccountDto: CreateUserAccountDto): Promise<{access_token: string}> {
        // create the user account
        const user = await this.userAccountService.create(createUserAccountDto);

        // generate the jwt
        const payload = {
            sub: user.id, 
            userName: user.userName,
            roles: user.roles
        };
        return {
            access_token: await this.jwtService.signAsync(payload)
        }
    }
}
