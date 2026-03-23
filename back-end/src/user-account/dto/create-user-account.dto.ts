import { IsString, IsNotEmpty, IsOptional, IsArray, IsIn, ValidateNested, IsObject } from "class-validator";
import { Transform, Type } from "class-transformer";
import { CreateProfileDto } from "./create-profile.dto";

export class CreateUserAccountDto {

    @IsNotEmpty()
    @IsString()
    email: string;

    @IsNotEmpty()
    @IsString()
    passwordHash: string;

    @IsNotEmpty()
    @IsString()
    userName: string;

    @IsNotEmpty()
    @IsObject()
    @ValidateNested()
    @Type(() => CreateProfileDto)
    profile: CreateProfileDto;

    @IsOptional()
    @IsArray()
    @IsIn(['user', 'admin'], { each: true })
    roleNames?: string[];
}
