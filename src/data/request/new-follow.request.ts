import { ApiProperty } from "@nestjs/swagger";


export class CreateFollowRequest {
    @ApiProperty({ name: 'user_id' })
    userId: string;

    @ApiProperty({ name: 'follower_id' })
    followerID: string;
}