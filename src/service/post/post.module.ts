
import { CryptStrategy } from "@auth/crypt.strategy";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PostRepository } from "@repository/post.repository";
import { UserRepository } from "@repository/user.repository";
import { UserModule } from "@service/user/user.module";
import { UserService } from "@service/user/user.service";
import { PostService } from "./post.service";

@Module({
    imports: [TypeOrmModule.forFeature([UserRepository, PostRepository]), UserModule],
    providers: [CryptStrategy,PostService, UserService],
    exports: [PostService]
})
export class PostModule { }