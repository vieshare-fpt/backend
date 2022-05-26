
import { CryptStrategy } from "@auth/crypt.strategy";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CategoryRepository } from "@repository/category.repository";
import { PostRepository } from "@repository/post.repository";
import { UserRepository } from "@repository/user.repository";
import { UserService } from "@service/user/user.service";
import { PostService } from "./post.service";

@Module({
    imports: [TypeOrmModule.forFeature([UserRepository, PostRepository,CategoryRepository])],
    providers: [CryptStrategy,PostService, UserService],
    exports: [PostService]
})
export class PostModule { }
