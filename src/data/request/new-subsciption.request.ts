import { ApiProperty } from "@nestjs/swagger";

export class NewSubscriptionRequest {
    @ApiProperty()
    options: number;
}
