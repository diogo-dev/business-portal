import { IsString, IsNotEmpty, IsOptional, IsInt, IsDateString, IsEnum, IsObject, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

class SocialLinksDto {
    @IsOptional()
    @IsString()
    facebook?: string;

    @IsOptional()
    @IsString()
    instagram?: string;

    @IsOptional()
    @IsString()
    twitter?: string;
}

export class CreateProfileDto {
    @IsOptional()
    @IsString()
    firstName?: string;

    @IsOptional()
    @IsString()
    lastName?: string;

    @IsOptional()
    @IsInt()
    age?: number;

    @IsOptional()
    @IsDateString()
    dob?: string;

    @IsOptional()
    @IsString()
    bio?: string;

    @IsOptional()
    @IsString()
    avatarUrl?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    postalCode?: string;

    @IsOptional()
    @IsString()
    city?: string;

    @IsOptional()
    @IsString()
    state?: string;

    @IsOptional()
    @IsString()
    country?: string;

    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => SocialLinksDto)
    socialLinks?: SocialLinksDto;

    @IsOptional()
    @IsEnum(['male', 'female', 'other'])
    gender?: string;

    @IsOptional()
    @IsString()
    occupation?: string;
}
