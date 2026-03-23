import { IsString, IsDate, IsNotEmpty, IsOptional, IsUrl } from "class-validator";
import { Type } from "class-transformer";

export class CreateEventDto {

    @IsOptional()
    @IsUrl()
    coverImageUrl: string;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    summary: string;

    @IsString()
    content: string;

    @IsString()
    location: string;

    @Type(() => Date)
    @IsDate()
    startsAt: Date;
    
    @Type(() => Date)
    @IsDate()
    endsAt: Date;
}
