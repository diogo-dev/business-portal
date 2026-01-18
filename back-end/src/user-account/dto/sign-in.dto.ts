import { IsString, IsNotEmpty, IsEmail } from "class-validator";
import { Transform } from "class-transformer";

export class SignInDto {
    @IsEmail()
    @Transform(({ value }) => value.trim().toLowerCase())
    email: string;

    @IsNotEmpty()
    @IsString()
    passwordHash: string;
}