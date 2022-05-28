import { ApiProperty } from "@nestjs/swagger";


export class CreateFollowRequest {
    @ApiProperty({ name: 'follower_id' })
    followerID: string;
}