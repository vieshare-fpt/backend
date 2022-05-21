import { IsEnum, IsString, IsNumber } from 'class-validator';
import { PostStatus } from "../entities/post.entity"

export class CreatePostDto {
    @IsString()
    title: string;

    @IsNumber()
    categoryId: number;

    @IsString()
    content: string;

    @IsNumber()
    ownerId: number;

    @IsNumber()
    views: number;

    @IsEnum(PostStatus)
    status: PostStatus;
}
