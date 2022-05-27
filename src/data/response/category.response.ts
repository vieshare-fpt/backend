import { CategoryEntity } from "@data/entity/category.entity";
import { ApiProperty } from "@nestjs/swagger";

export class CategoryResponse {
    @ApiProperty()
    id:string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    isDelete: boolean

    constructor(category : CategoryEntity) {
        this.id = category.id;
        this.name = category.name;
        this.isDelete = category.isDelete;
    }

}