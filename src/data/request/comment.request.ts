import { ApiProperty } from '@nestjs/swagger';

export class CommentRequest {
  @ApiProperty()
  postId: string;

  @ApiProperty()
  content: string;
}
