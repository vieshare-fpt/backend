import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CommmentRepository } from "@repository/comment.repository";
import { PostRepository } from "@repository/post.repository";
import { UserRepository } from "@repository/user.repository";
import { CommonService } from "@service/common/common.service";
import { CommentService } from "./comment.service";

@Module({
    imports: [TypeOrmModule.forFeature([CommmentRepository,UserRepository,PostRepository])],
    providers: [CommentService,CommonService],
    exports: [CommentService]
})

export class CommentModule { }
