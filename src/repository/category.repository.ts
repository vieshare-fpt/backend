import { CategoryEntity } from "@data/entity/category.entity";
import { EntityRepository, Repository } from "typeorm";


@EntityRepository(CategoryEntity)
export class CategoryRepository extends Repository<CategoryEntity>{
    async isExist(id:string): Promise<Boolean> {
        const isExist = await this.findOne({id: id});
        if(!isExist) return false;
        return true;
    }
}
