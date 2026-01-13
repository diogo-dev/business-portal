import { IsString, IsNotEmpty, IsUUID } from "class-validator";

export class CreatePostCommentDto {
    @IsNotEmpty()
    @IsString()
    content: string;

    @IsNotEmpty()
    @IsUUID()
    postId: string;
}
