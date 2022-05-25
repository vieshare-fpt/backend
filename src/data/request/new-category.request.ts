import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";


export class NewCategoryRequest {
    @ApiProperty()
    @IsNotEmpty()
    name: string;
}