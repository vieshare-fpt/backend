import { StatusPost } from "@constant/status-post.enum";
import { TypePost } from "@constant/types-post.enum";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";


export class UpdatePostRequest {
    @ApiProperty()
    @IsNotEmpty()
    id : string

    @ApiProperty()
    title: string

    @ApiProperty()
    categoryId: string

    @ApiProperty()
    content: string

    @ApiProperty({ format: "enum", enum: TypePost })
    type: TypePost;

    @ApiProperty({ format: "enum", enum: StatusPost })
    status: StatusPost;
}
