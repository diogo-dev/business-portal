import { IsString, IsNotEmpty, IsArray } from "class-validator";
import { Permission } from "src/permission/permission.entity";

export class CreateRoleDto {
    
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    description: string;

    @IsString()
    @IsNotEmpty()
    @IsArray()
    permissions: Permission[];
}