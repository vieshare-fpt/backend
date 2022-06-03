import { TypePost } from "@constant/types-post.enum";
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsNumber, IsUUID } from "class-validator";

export class VoteRequest {
  @ApiProperty()
  @IsUUID()
  postId: string

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  point: number

}
