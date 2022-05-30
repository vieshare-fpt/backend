import { ApiProperty } from "@nestjs/swagger";

export class FollowResponse {
    @ApiProperty()
    follower_id: string;

    @ApiProperty()
    follow_at: Date;

    constructor(followerID: string, follow_at: Date) {
        this.follower_id = followerID;
        this.follow_at = follow_at;
    }
}