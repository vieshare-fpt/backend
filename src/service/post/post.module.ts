
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PostRepository } from "@repository/post.repository";
import { UserRepository } from "@repository/user.repository";
import { PostService } from "./post.service";

@Module({
    imports: [TypeOrmModule.forFeature([UserRepository,PostRepository])],
    providers: [PostService],
    exports: [PostService]
})
export class PostModule { }