import { ApiProperty } from "@nestjs/swagger";
import { TotalByPostResponse } from "./total-by-post.response";

export class WriterTotalResponse {
  @ApiProperty()
  views: TotalByPostResponse;

  @ApiProperty()
  comments: TotalByPostResponse;

  @ApiProperty()
  posts: TotalByPostResponse;

  @ApiProperty()
  incomes: number;

  @ApiProperty()
  follows: number;


  constructor(views: TotalByPostResponse, comments: TotalByPostResponse, posts: TotalByPostResponse, incomes: number, follows: number) {
    this.views = views;
    this.comments = comments;
    this.posts = posts;
    this.incomes = incomes;
    this.follows = follows;
  }
}
