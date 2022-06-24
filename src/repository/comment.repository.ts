import { CommentEntity } from "@data/entity/comment.entity";
import { EntityRepository, FindCondition, Repository } from "typeorm";

@EntityRepository(CommentEntity)
export class CommmentRepository extends Repository<CommentEntity>{
  async newComment(postId: string, userId: string, content: string) {
    const comment: CommentEntity = new CommentEntity();
    comment.postId = postId;
    comment.userId = userId;
    comment.content = content;
    comment.publishDate = new Date();
    return await this.save(comment);
  }

  async getComments(where: FindCondition<CommentEntity>, skip?: number, take?: number): Promise<CommentEntity[]> {
    const comments = await this.find(
      {
        where: where,
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
    const postsResponse = object.map(({ content, authorId, categoryId, ...postResponse }) => {
      this.changeNamePropertyObject(postResponse, '__user__', 'user');
      this.changeNamePropertyObject(postResponse, '__post__', 'post');
      delete postResponse['user']['password'];
      delete postResponse['post']['content'];
      delete postResponse['userId'];
      delete postResponse['postId'];
      return postResponse;
    })
    return postsResponse;
  }
  private changeNamePropertyObject(object: any, oldName: string, newname: string) {
    object[newname] = object[oldName];
    delete object[oldName];
    return true;
  }
}
