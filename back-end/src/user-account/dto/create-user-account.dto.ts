import { IsString, IsNotEmpty, IsOptional, IsArray, IsIn } from "class-validator";
import { Profile } from "../entities/profile.entity";

export class CreateUserAccountDto {

    @IsNotEmpty()
    @IsString()
    email: string;

    @IsNotEmpty()
    @IsString()
    passwordHash: string;

    @IsNotEmpty()
    @IsString()
    phone: string;

    @IsNotEmpty()
    @IsString()
    userName: string;

    @IsNotEmpty()
    profile: Profile;

    @IsOptional()
    @IsArray()
    @IsIn(['user', 'admin'], { each: true })
    roleNames?: string[];
}
