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
    description: string;

    @IsString()
    location: string;

    @Type(() => Date)
    @IsDate()
    startsAt: Date;
    
    @Type(() => Date)
    @IsDate()
    endsAt: Date;
}
