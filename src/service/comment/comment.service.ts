import { PostNotExistedException } from "@exception/post/post-not-existed.exception";
import { UserNotExistedException } from "@exception/user/user-not-existed.exception";
import { Injectable } from "@nestjs/common";
import { CommmentRepository } from "@repository/comment.repository";
import { PostRepository } from "@repository/post.repository";
import { UserRepository } from "@repository/user.repository";

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

    async getCommetByPostId(
        postId: string,
        perPage: number,
        page: number
    ) {
        this.commentRepository.find({ where: { postId: postId } })
    }

}