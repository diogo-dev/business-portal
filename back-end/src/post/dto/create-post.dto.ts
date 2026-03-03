import { IsString, IsNotEmpty, IsOptional, IsUrl, IsArray } from "class-validator";
import { Transform } from "class-transformer";

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

    @IsOptional()
    @Transform(({ value }) => Array.isArray(value) ? value : [value])
    @IsString({ each: true })
    @IsArray()
    categoriesNames: string[];
}
