import { ApiProperty } from "@nestjs/swagger";


export class CreateCategoryResponse {
    @ApiProperty()
    id: string;

    constructor(id: string) {
        this.id = id;
    }
}