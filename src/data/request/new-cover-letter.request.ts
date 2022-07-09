import { PositionApply } from "@constant/position-apply.enum";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class NewCoverLetterRequest {
    @ApiProperty()
    @IsNotEmpty()
    title: string

    @ApiProperty()
    @IsNotEmpty()
    content : string

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    positionApply: PositionApply;
}
