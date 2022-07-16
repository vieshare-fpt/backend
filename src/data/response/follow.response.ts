import { ApiProperty } from "@nestjs/swagger";

export class FollowResponse {
    @ApiProperty()
    followerId: string;

    @ApiProperty()
    followAt: Date;

    constructor(followerId: string, followAt: Date) {
        this.followerId = followerId;
        this.followAt = followAt;
    }
}
