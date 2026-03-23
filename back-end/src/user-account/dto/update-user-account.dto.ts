import { PartialType } from '@nestjs/mapped-types';
import { CreateUserAccountDto } from './create-user-account.dto';
import { IsOptional, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { CreateProfileDto } from './create-profile.dto';

export class UpdateUserAccountDto extends PartialType(CreateUserAccountDto) {}
