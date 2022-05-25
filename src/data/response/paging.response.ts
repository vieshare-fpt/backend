import { ApiProperty } from '@nestjs/swagger';

export class PagingRepsone {
    @ApiProperty()
    page: number;

    @ApiProperty()
    per_page: number;

    @ApiProperty()
    total: number;

    @ApiProperty()
    total_pages: number;

    constructor(page: number, per_page: number, total: number, total_pages: number) {
        this.page = +page;
        this.per_page = +per_page;
        this.total = +total;
        this.total_pages = +total_pages;
    }
}
