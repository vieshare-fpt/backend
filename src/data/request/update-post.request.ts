import { StatusPost } from "@constant/status-post.enum";
import { TypePost } from "@constant/types-post.enum";
import { ApiProperty } from "@nestjs/swagger";


export class UpdatePostRequest {
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
