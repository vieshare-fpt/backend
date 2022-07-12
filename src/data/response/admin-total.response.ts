import { ApiProperty } from "@nestjs/swagger";
import { TotalByPostResponse } from "./total-by-post.response";
import { TotalByUserResponse } from "./total-by-user.response";


export class AdminTotalResponse {
  @ApiProperty()
  views: TotalByPostResponse;

  @ApiProperty()
  comments: TotalByPostResponse;

  @ApiProperty()
  posts: TotalByPostResponse;

  @ApiProperty()
  incomes: number;

  @ApiProperty()
  users: TotalByUserResponse

  constructor(views: TotalByPostResponse, comments: TotalByPostResponse, posts: TotalByPostResponse, incomes: number, users: TotalByUserResponse) {
    this.views = views;
    this.comments = comments;
    this.posts = posts;
    this.incomes = incomes;
    this.users = users;
  }
}
