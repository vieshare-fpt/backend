
import { CryptStrategy } from "@auth/crypt.strategy";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CategoryRepository } from "@repository/category.repository";
import { HistoryRepository } from "@repository/history.repository";
import { PostRepository } from "@repository/post.repository";
import { UserRepository } from "@repository/user.repository";
import { CommonService } from "@service/common/common.service";
import { UserService } from "@service/user/user.service";
import { PostService } from "./post.service";

@Module({
    imports: [TypeOrmModule.forFeature([UserRepository, PostRepository,CategoryRepository,HistoryRepository])],
    providers: [CryptStrategy,PostService, UserService, CommonService],
    exports: [PostService]
})
export class PostModule { }
