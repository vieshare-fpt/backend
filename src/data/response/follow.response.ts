import { ApiProperty } from "@nestjs/swagger";

export class FollowResponse {
    @ApiProperty()
    followerID: string;

    @ApiProperty()
    follow_at: Date;

    constructor(followerID: string, follow_at: Date) {
        this.followerID = followerID;
        this.follow_at = follow_at;
    }
}