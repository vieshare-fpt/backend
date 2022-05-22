import { TypePost } from "@constant/types-post.enum";
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsUUID } from "class-validator";

export class UpdatePostRequest {
    @ApiProperty()
    @IsUUID()
    id: string

    @ApiProperty()
    @IsNotEmpty()
    title: string

    @ApiProperty()
    @IsNotEmpty()
    @IsUUID()
    categoryId: string

    @ApiProperty()
    @IsNotEmpty()
    content: string

    @ApiProperty({ format: "enum", enum: TypePost })
    @IsNotEmpty()
    @IsEnum(TypePost)
    type: TypePost;
}