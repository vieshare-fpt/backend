import { Injectable } from "@nestjs/common";
import { CategoryRepository } from "@repository/category.repository";
import { CategoryEntity } from "@data/entity/category.entity";
import { CategoryExistedException } from "@exception/category/category-existed.exception";
import { NewCategoryRequest } from "@data/request/new-category.request";
import { CategoryNotExistedException } from "@exception/category/category-not-existed.exception";
import { UpdateCategoryRequest } from "@data/request/update-category.request";
import { HttpResponse } from "@common/http.response";
import { CategoryResponse } from "@data/response/category.response";


@Injectable()
export class CategoryService {
    constructor(
        private categoryRepository: CategoryRepository,
    ) {}

    async createCategory(
        request: NewCategoryRequest,
    ): Promise<CategoryEntity> {
        if (!this.categoryRepository.isExist(request.name)) {
            throw new CategoryExistedException();
        }
        const categoryEntity: CategoryEntity = new CategoryEntity();
        categoryEntity.name = request.name;
        return await this.categoryRepository.save(categoryEntity);
    };

    async getCategoryById(
        id: string,
    ): Promise<CategoryResponse> {
        const category = await this.categoryRepository.findOne(id);
        if (!category) {
            throw new CategoryNotExistedException();
        }
        return category;
    };

    async getListCategory(

    ): Promise<CategoryResponse[]>{
        const category = await this.categoryRepository.find({});
        if (!category) {
            throw new CategoryNotExistedException();
        }
        return category;
    };

    async deleteCategory(
        id: string,
    ): Promise<any> {

        if (!this.categoryRepository.isExist(id)) {
            throw new CategoryNotExistedException();
        }
        this.categoryRepository.update({ id: id }, { isDelete: true })
    }

    async updateCategory(
        id: string,
        request: UpdateCategoryRequest,
    ): Promise<any> {

        const existedCate = await this.categoryRepository.findOne(id)
        if (!existedCate) {
            throw new CategoryNotExistedException();
        }

        const updateCateEntity: CategoryEntity = new CategoryEntity()
        updateCateEntity.id = request.id;
        updateCateEntity.name = request.cateName;
        updateCateEntity.isDelete = request.isDelete;

        return await this.categoryRepository
            .update({ id: request.id },{...existedCate,...updateCateEntity})
    }
}