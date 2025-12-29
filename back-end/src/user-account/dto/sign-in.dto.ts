import { IsString, IsNotEmpty } from "class-validator";

export class SignInDto {
    @IsNotEmpty()
    @IsString()
    userName: string;

    @IsNotEmpty()
    @IsString()
    passwordHash: string;
}