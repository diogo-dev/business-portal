import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserAccountService } from 'src/user-account/user-account.service';
import bcrypt from "bcrypt";
import { JwtService } from '@nestjs/jwt';
import { CreateUserAccountDto } from 'src/user-account/dto/create-user-account.dto';

@Injectable()
export class AuthService {
    constructor(
        private userAccountService: UserAccountService,
        private jwtService: JwtService
    ) {}

    async signIn(userName: string, password: string): Promise<{access_token: string}> {
        // search for user
        const user = await this.userAccountService.findOneByUserName(userName);
        if (!user) throw new NotFoundException(`User ${userName} not found`);

        // verify the password
        const passwordMatches = await bcrypt.compare(password, user.passwordHash);
        if (!passwordMatches) throw new UnauthorizedException();

        // generate the jwt
        const payload = {sub: user.id, userName: user.userName};
        return {
            access_token: await this.jwtService.signAsync(payload)
        }
    }

    async signUp(createUserAccountDto: CreateUserAccountDto): Promise<{access_token: string}> {
        // create the user account
        const user = await this.userAccountService.create(createUserAccountDto);

        // generate the jwt
        const payload = {sub: user.id, userName: user.userName};
        return {
            access_token: await this.jwtService.signAsync(payload)
        }
    }
}
