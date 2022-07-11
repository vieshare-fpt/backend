import { ApiProperty } from "@nestjs/swagger";

export class WriterTotalResponse {
    @ApiProperty()
    views: number;

    @ApiProperty()
    comments: number;

    @ApiProperty()
    posts: number;

    @ApiProperty()
    incomes: number;


    constructor(views: number, comments: number,posts : number, incomes: number) {
        this.views = views;
        this.comments = comments;
        this.posts = posts;
        this.incomes = incomes;
    }
}
