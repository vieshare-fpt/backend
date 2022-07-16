import { ApiProperty } from "@nestjs/swagger";


export class CreateFollowRequest {
    @ApiProperty({ name: 'followerId' })
    followerId: string;
}
