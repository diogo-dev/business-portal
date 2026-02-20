import { IsString, IsNotEmpty, IsOptional, IsUrl } from "class-validator";

export class CreatePostDto {

    @IsOptional()
    @IsUrl()
    coverImageUrl?: string;

    @IsString()
    @IsNotEmpty({ message: 'Empty Title ' })
    title: string;

    @IsString()
    @IsNotEmpty({ message: 'Empty Content' })
    content: string;

    @IsOptional()
    @IsString()
    summary?: string;
}
