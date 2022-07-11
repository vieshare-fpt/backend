import { CommentEntity } from "@data/entity/comment.entity";
import { EntityRepository, FindCondition, OrderByCondition, Repository } from "typeorm";

@EntityRepository(CommentEntity)
export class CommentRepository extends Repository<CommentEntity>{
  async newComment(postId: string, userId: string, content: string) {
    const comment: CommentEntity = new CommentEntity();
    comment.postId = postId;
    comment.userId = userId;
    comment.content = content;
    comment.publishDate = new Date();
    return await this.save(comment);
  }

  async getComments(where: FindCondition<CommentEntity>, order: OrderByCondition, skip?: number, take?: number): Promise<CommentEntity[]> {
    const comments = await this.find(
      {
        where: where,
        order: order,
        relations: ['user', 'post'],
        skip: skip || 0,
        take: take || null
      })
    const commentsResponse = this.formatCommentsResponse(comments);
    return commentsResponse;

  }

  async isCommenter(userId: string, commentId: string): Promise<Boolean> {
    return (await this.count({ where: { userId: userId, id: commentId } })) == 0 ? false : true
  }

  async countComments(where: FindCondition<CommentEntity>): Promise<number> {
    return await this.count({ where: where });
  }


  private formatCommentsResponse(object: any) {
    const postsResponse = object.map(({ ...commentResponse }) => {
      this.changeNamePropertyObject(commentResponse, '__user__', 'user');
      this.changeNamePropertyObject(commentResponse, '__post__', 'post');
      delete commentResponse['user']['password'];
      delete commentResponse['post']['content'];
      delete commentResponse['userId'];
      delete commentResponse['postId'];
      return commentResponse;
    })
    return postsResponse;
  }
  private changeNamePropertyObject(object: any, oldName: string, newname: string) {
    object[newname] = object[oldName];
    delete object[oldName];
    return true;
  }
}
