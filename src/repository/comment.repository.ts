import { TimeFrame } from "@constant/time-frame.enum";
import { TypePost } from "@constant/types-post.enum";
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

  async sumComments(typePost: TypePost) {
    const { count } = await this.createQueryBuilder("comments")
      .leftJoinAndSelect('comments.post', 'posts')
      .where('posts.type = :typePost', { typePost })
      .select("COUNT(comments.id)", "count")
      .getRawOne();
    return parseInt(count ? count : 0);
  }

  async sumCommentsByUserId(userId: string, typePost: TypePost) {
    const { count } = await this.createQueryBuilder("comments")
      .leftJoinAndSelect('comments.post', 'posts')
      .where('posts.type = :typePost', { typePost })
      .andWhere('posts.author = :userId', { userId })
      .select("COUNT(comments.id)", "count")
      .getRawOne();
    return parseInt(count ? count : 0);
  }

  async statisticComments(from: string, to: string, timeFrame: TimeFrame) {
    let group = "";
    if (timeFrame == TimeFrame.OneDay) {
      group = "DATE_FORMAT(comments.publishDate, '%Y-%m-%d')";
    }
    if (timeFrame == TimeFrame.OneMonth) {
      group = "DATE_FORMAT(comments.publishDate, '%Y-%m')";
    }
    if (timeFrame == TimeFrame.OneYear) {
      group = "DATE_FORMAT(comments.publishDate, '%Y')";
    }
    const statisticComments = await this.createQueryBuilder('comments')
      .where('comments.publishDate >= :from', { from })
      .andWhere('comments.publishDate <= :to', { to })
      .leftJoinAndSelect('comments.post', 'post')
      .select(group, 'date')
      .addSelect('post.type', 'name')
      .addSelect('COUNT(*)', 'value')
      .groupBy(group)
      .addGroupBy('post.type')
      .getRawMany();

    return statisticComments;
  }
  async statisticCommentsByWriterId(authorId: string, from: string, to: string, timeFrame: TimeFrame) {
    let group = "";
    if (timeFrame == TimeFrame.OneDay) {
      group = "DATE_FORMAT(comments.publishDate, '%Y-%m-%d')";
    }
    if (timeFrame == TimeFrame.OneMonth) {
      group = "DATE_FORMAT(comments.publishDate, '%Y-%m')";
    }
    if (timeFrame == TimeFrame.OneYear) {
      group = "DATE_FORMAT(comments.publishDate, '%Y')";
    }
    const statisticComments = await this.createQueryBuilder('comments')
      .where('comments.publishDate >= :from', { from })
      .andWhere('comments.publishDate <= :to', { to })
      .leftJoinAndSelect('comments.post', 'post')
      .andWhere('post.authorId = :authorId', { authorId })
      .select(group, 'date')
      .addSelect('post.type', 'name')
      .addSelect('COUNT(*)', 'value')
      .groupBy(group)
      .addGroupBy('post.type')
      .getRawMany();

    return statisticComments;
  }
}
