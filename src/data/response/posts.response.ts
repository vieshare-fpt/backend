import { StatusPost } from '@constant/status-post.enum';
import { TypePost } from '@constant/types-post.enum';
import { PostEntity } from '@data/entity/post.entity';
import { ApiProperty } from '@nestjs/swagger';

export class PostsResponse {
    @ApiProperty()
    id: string;

    @ApiProperty()
    title: string;

    @ApiProperty()
    categoryId: string;

    @ApiProperty()
    authorId: string;

    @ApiProperty()
    publishDate: number;

    @ApiProperty()
    lastUpdated: number | null;

    @ApiProperty()
    views: number;

    @ApiProperty()
    status: StatusPost;

    @ApiProperty()
    type: TypePost;

    constructor(post : PostEntity) {
        this.id = post.id;
        this.title = post.title;
        this.categoryId = post.categoryId;
        this.authorId = post.authorId;
        this.publishDate = post.publishDate;
        this.lastUpdated = post.lastUpdated;
        this.views = post.views;
        this.status = post.status;
        this.type = post.type
    }



}
