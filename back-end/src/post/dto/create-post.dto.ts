import { IsString, IsNotEmpty, IsOptional, IsUrl } from "class-validator";

export class CreatePostDto {

    @IsOptional()
    @IsUrl()
    coverImageUrl: string;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsOptional()
    @IsString()
    summary: string;
}
