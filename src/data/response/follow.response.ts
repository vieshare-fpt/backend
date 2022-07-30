import { ApiProperty } from "@nestjs/swagger";

export class FollowResponse {
    @ApiProperty()
    followId: string;

    @ApiProperty()
    followAt: Date;

    constructor(followId: string, followAt: Date) {
        this.followId = followId;
        this.followAt = followAt;
    }
}
