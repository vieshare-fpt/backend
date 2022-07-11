import { ApiProperty } from "@nestjs/swagger";

export class AdminTotalResponse {
    @ApiProperty()
    views: number;

    @ApiProperty()
    comments: number;

    @ApiProperty()
    posts: number;

    @ApiProperty()
    incomes: number;

    @ApiProperty()
    users: number

    constructor(views: number, comments: number,posts : number, incomes: number,users: number) {
        this.views = views;
        this.comments = comments;
        this.posts = posts;
        this.incomes = incomes;
        this.users = users;
    }
}
