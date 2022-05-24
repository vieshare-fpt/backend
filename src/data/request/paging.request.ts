import { ApiProperty } from "@nestjs/swagger";

export class PagingRequest {
    @ApiProperty()
    per_page: number

    @ApiProperty()
    page: number
}