import { HttpPagingResponse } from "@common/http-paging.response";
import { HttpResponse } from "@common/http.response";
import { User } from "@common/user";
import { CommentEntity } from "@data/entity/comment.entity";
import { PagingRequest } from "@data/request/paging.request";
import { PagingRepsone } from "@data/response/paging.response";
import { CommentNotExistedException } from "@exception/comment/comment-not-existed.exception";
import { UserNotCommenterPostException } from "@exception/comment/user-not-commenter-post.exception";
import { PostNotExistedException } from "@exception/post/post-not-existed.exception";
import { UserNotExistedException } from "@exception/user/user-not-existed.exception";
import { Injectable } from "@nestjs/common";
import { CommmentRepository } from "@repository/comment.repository";
import { PostRepository } from "@repository/post.repository";
import { UserRepository } from "@repository/user.repository";
import { UpdateResult } from "typeorm";

@Injectable()
export class CommentService {
    constructor(
        private commentRepository: CommmentRepository,
        private userRepository: UserRepository,
        private postRepository: PostRepository
    ) { }

    async createComment(postId: string, userId: string, content: string) {
        const userExsited = await this.userRepository.findOne(userId)
        if (!userExsited) {
            throw new UserNotExistedException()
        }

        const postExsited = await this.postRepository.findOne(postId)
        if (!postExsited) {
            throw new PostNotExistedException()
        }

        return await this.commentRepository.newComment(postExsited.id, userExsited.id, content)
    }

    async getCommets(
        paging: PagingRequest
    ): Promise<HttpResponse<CommentEntity[]> | HttpPagingResponse<CommentEntity[]>> {
        const page = paging.page | 1;
        const perPage = paging.per_page;
        const comments = await this.commentRepository.getComments(perPage * (page - 1), perPage)
        const total = await this.commentRepository.countComments();
        const totalPages = Math.ceil(total / perPage);
        const metaData = new PagingRepsone(page, perPage, total, totalPages);
        if (!perPage) {
            return HttpResponse.success(comments);
        }
        return HttpPagingResponse.success(comments, metaData);
    }

    async getCommetsByPostId(
        postId: string,
        paging: PagingRequest
    ): Promise<HttpResponse<CommentEntity[]> | HttpPagingResponse<CommentEntity[]>> {
        const page = paging.page | 1;
        const perPage = paging.per_page;
        const comments = await this.commentRepository.getCommentsByPostId(postId, perPage * (page - 1), perPage)
        const total = await this.commentRepository.countComments(postId);
        const totalPages = Math.ceil(total / perPage);
        const metaData = new PagingRepsone(page, perPage, total, totalPages);
        if (!perPage) {
            return HttpResponse.success(comments);
        }
        return HttpPagingResponse.success(comments, metaData);
    }


    async deleteComment(user: User, id: string): Promise<UpdateResult> {
        const existedComment = await this.commentRepository.findOne(id);
        if (!existedComment) {
            throw new CommentNotExistedException();
        }

        if (existedComment.userId !== user.id) {
            throw new UserNotCommenterPostException();
        }

        return await this.commentRepository.update({ id: id }, { isDelete: true })
    }

}
