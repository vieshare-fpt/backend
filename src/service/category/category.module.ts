import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CategoryRepository } from "@repository/category.repository";
import { PostRepository } from "@repository/post.repository";
import { CommonService } from "@service/common/common.service";
import { CategoryService } from "./category.service";

@Module({
    imports: [TypeOrmModule.forFeature([CategoryRepository])],
    providers: [CategoryService, CommonService],
    exports: [CategoryService]
})
export class CategoryModule { }
