import { ApiProperty } from '@nestjs/swagger'

export class PostIdRequest {

  @ApiProperty({ name: 'postId', type: 'string', example: '0483af39-1fdd-40eb-9d1b-f49f456e2abd' })
  postId: string
}
