import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";


export class UpdateCategoryRequest {
    @ApiProperty()
    @IsUUID()
    id: string;

    @ApiProperty()
    @IsNotEmpty()
    cateName: string;

    @ApiProperty({default: true})
    isDelete: boolean;
}