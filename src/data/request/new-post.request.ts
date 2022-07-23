import { StatusPost } from "@constant/status-post.enum";
import { TypePost } from "@constant/types-post.enum";
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsUUID } from "class-validator";

export class NewPostRequest {
    @ApiProperty()
    @IsNotEmpty()
    title: string

    @ApiProperty()
    @IsNotEmpty()
    thumbnail : string

    @ApiProperty()
    @IsNotEmpty()
    @IsUUID()
    categoryId: string

    @ApiProperty()
    @IsNotEmpty()
    description: string

    @ApiProperty()
    @IsNotEmpty()
    content: string

    @ApiProperty({ format: "enum", enum: TypePost })
    @IsNotEmpty()
    @IsEnum(TypePost)
    type: TypePost;

    @ApiProperty()
    status : StatusPost;

}
