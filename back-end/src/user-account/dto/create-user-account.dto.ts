import { IsString, IsNotEmpty } from "class-validator";

export class CreateUserAccountDto {

    @IsNotEmpty()
    @IsString()
    email: string;

    @IsNotEmpty()
    @IsString()
    passwordHash: string;

    @IsNotEmpty()
    @IsString()
    phone: string;

    @IsNotEmpty()
    @IsString()
    userName: string;
}
