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
}
