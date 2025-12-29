import { IsString, IsDate, IsNotEmpty } from "class-validator";

export class CreateEventDto {

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    description: string;

    @IsString()
    location: string;

    @IsDate()
    startsAt: Date;
    
    @IsDate()
    endsAt: Date;
}
