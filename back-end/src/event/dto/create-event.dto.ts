import { IsString, IsDate, IsNotEmpty } from "class-validator";
import { Type } from "class-transformer";

export class CreateEventDto {

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
