import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";

import { Controller, Post, Body, HttpCode, HttpStatus, Patch, Delete, Get, Param, Query } from "@nestjs/common";
import { CategoryService } from "@service/category/category.service";
import { HttpResponse } from "@common/http.response";
import { CreateCategoryResponse } from "@data/response/new-category.response";
import { UpdateCategoryRequest } from "@data/request/update-category.request";
import { Roles } from "@decorator/role.decorator";
import { Role } from "@constant/role.enum";
import { CategoryResponse } from "@data/response/category.response";
import { UpdateResult } from "typeorm";
import { Public } from "@decorator/public.decorator";
import { HttpPagingResponse } from "@common/http-paging.response";
import { PagingRequest } from "@data/request/paging.request";



@ApiTags('Category')
@Controller('api/categories')
export class CategoryController {
    constructor(
        private categoryService: CategoryService) { }


    // @ApiBearerAuth()
    // @Roles(Role.Admin)
    // @Post()
    // @HttpCode(HttpStatus.CREATED)
    // async createCategory(
    //     @Body() request: NewCategoryRequest,
    //     ): Promise<HttpResponse<CreateCategoryResponse>> {
    //     const category = await this.categoryService.createCategory(request)
    //     return HttpResponse.success(new CreateCategoryResponse(category.id));
    // } 

    @ApiBearerAuth()
    @Roles(Role.Admin)
    @Patch()
    @HttpCode(HttpStatus.OK)
    async updateCategory(
        @Body() updateCategory: UpdateCategoryRequest
    ): Promise<any> {
        const category = await this.categoryService.updateCategory(updateCategory.id, updateCategory)
        return HttpResponse.success(new CreateCategoryResponse(category))
    }

    //get list categories
    @Public()
    @Get('')
    @HttpCode(HttpStatus.OK)
    @ApiQuery({ name: 'per_page', type: 'number', example: 10, required: false })
    @ApiQuery({ name: 'page', type: 'number', example: 1, required: false })
    async getListCategory(
        @Query() paging: PagingRequest
    ): Promise<HttpResponse<CategoryResponse[]> | HttpPagingResponse<CategoryResponse[]>> {
        const categoriesResponse = await this.categoryService.getListCategory(paging.per_page, paging.page);
        return categoriesResponse;
    }


    // get categories by category id
    @Public()
    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async getListCategoryById(
        @Param('id') category_id: string,
    ): Promise<CategoryResponse> {
        return await this.categoryService.getCategoryById(category_id);
    }

    //delete
    @ApiBearerAuth()
    @Roles(Role.Admin)
    @Delete(':id')
    async deleteCategory(
        @Param('id') category_id: string,
    ): Promise<HttpResponse<UpdateResult>> {
        const deleteCategory = await this.categoryService.deleteCategory(category_id);
        return await HttpResponse.success(deleteCategory);
    }


}
