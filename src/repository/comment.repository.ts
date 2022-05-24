import { CommentEntity } from "@data/entity/comment.entity";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(CommentEntity)
export class CommmentRepository extends Repository<CommentEntity>{
    async newComment(postId: string, userId: string, content: string) {
        const comment: CommentEntity = new CommentEntity();
        comment.postId = postId;
        comment.userId = userId;
        comment.content = content;
        comment.publishDate = new Date().getTime();
        return await this.save(comment);
    }

    async getComments(skip?: number, take?: number): Promise<CommentEntity[]> {
        const comments = await this.find({ skip: skip || 0, take: take || null })
        return comments;
    }

    async getCommentsByUserId(userId?: string, skip?: number, take?: number): Promise<CommentEntity[]> {
        const comments = await this.find({ where: { userId: userId }, skip: skip || 0, take: take || null })
        return comments;
    }

    async getCommentsByPostId(postId?: string, skip?: number, take?: number): Promise<CommentEntity[]> {
        const comments = await this.find({ where: { postId: postId }, skip: skip || 0, take: take || null })
        return comments;
    }

    async isCommenter(userId: string, commentId: string): Promise<Boolean> {
        return (await this.count({ where: { userId: userId, id: commentId } })) == 0 ? false : true
    }

    async countComments(postId?: string): Promise<number> {
        if (postId) {
            return await this.count({ where: { postId: postId } })
        }
        return await this.count()
    }
}
