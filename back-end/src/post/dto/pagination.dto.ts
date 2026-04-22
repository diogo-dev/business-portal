import { Transform, Type } from "class-transformer";
import { IsArray, IsEnum, IsInt, IsOptional, IsString, Max, Min, ValidateNested } from "class-validator";
import { PostStatus } from "../enum/post-status.enum";
import { PostOrder } from "src/shared";

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @IsOptional()
  @IsEnum(PostOrder, { message: `status must be one of: ${Object.values(PostOrder).join(', ')}`})
  sort?: PostOrder;

  @IsOptional()
  @IsEnum(PostStatus, { message: `status must be one of: ${Object.values(PostStatus).join(', ')}` })
  status?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({value}) => Array.isArray(value) ? value : [value])
  categories?: string[]
}