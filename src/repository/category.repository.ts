import { CategoryEntity } from "@data/entity/category.entity";
import { CategoryResponse } from "@data/response/category.response";
import { EntityRepository, Repository } from "typeorm";


@EntityRepository(CategoryEntity)
export class CategoryRepository extends Repository<CategoryEntity>{
    async isExist(id: string): Promise<Boolean> {
        const isExist = await this.findOne({ id: id });
        if (!isExist) return false;
        return true;
    }

    async getListCategory(skip?: number, take?: number): Promise<CategoryResponse[]> {
        const categories = await this.find({ skip: skip || 0, take: take || null })
        const categoryResponse = categories.map(({ ...categoryResponse }) => categoryResponse);
        return categoryResponse;
    }
}
