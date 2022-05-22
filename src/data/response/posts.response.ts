import { StatusPost } from '@constant/status-post.enum';
import { TypePost } from '@constant/types-post.enum';
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


    constructor(id: string, title: string, categoryId: string, authorId: string, publishDate: number, lastUpdated: number | null, views: number, status: StatusPost, type: TypePost) {
        this.id = id;
        this.title = title;
        this.categoryId = categoryId;
        this.authorId = authorId;
        this.publishDate = publishDate;
        this.lastUpdated = lastUpdated;
        this.views = views;
        this.status = status;
        this.type = type
    }
}
