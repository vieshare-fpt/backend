import { HistoryEntity } from "@data/entity/history.entity";
import { PostEntity } from "@data/entity/post.entity";
import { UserEntity } from "@data/entity/user.entity";
import { EntityRepository, FindConditions, LessThan, MoreThan, Repository } from "typeorm";


@EntityRepository(HistoryEntity)
export class HistoryRepository extends Repository<HistoryEntity>{

  async getAll(where: FindConditions<HistoryEntity>, skip?: number, take?: number) {

    const history = await this.find(
      {
        where: where,
        order: {
          lastDateRead: 'DESC'
        },
        relations: ['user', 'post', 'post.author', 'post.category'],
        skip: skip || 0,
        take: take || null
      });
    const postsResponse = this.formatHistoryResponse(history);
    return postsResponse;
  }

  async getCategoryReadMostByUserId(userId: string, withinWeek?: number) {
    if (!(await this.historyNotNullByUserId(userId))) return []
    withinWeek = withinWeek ? withinWeek : 1
    const time = 1000 * 60 * 60 * 24 * 7 * withinWeek;
    const history = await this.createQueryBuilder('history')
      .where({ userId: userId, lastDateRead: MoreThan(new Date().getTime() - time) })
      .leftJoinAndSelect('history.post', 'post')
      .select('post.categoryId', 'categoryId')
      .addSelect('COUNT(history.id)', 'count')
      .groupBy("post.categoryId")
      .orderBy('count', 'DESC')
      .getRawMany()
    if (history.length == 0) {
      return await this.getCategoryReadMostByUserId(userId, withinWeek + 1)
    }
    return history;
  }
  async getPostsIdReadedByUserId(userId: string) {
    const history = await this.createQueryBuilder('history')
      .where('history.userId = :userId', { userId: userId })
      .leftJoinAndSelect('history.post', 'post')
      .select('post.id', 'postId')
      .groupBy("post.categoryId")
      .getRawMany();

    return history;
  }

  async historyNotNullByUserId(userId: string): Promise<Boolean> {
    const history = this.findOne({ where: { userId: userId } })
    if (!history) return false;
    return true
  }

  async getByPostIdAndUserId(postId: string, userId: string): Promise<HistoryEntity> {
    const history = await this.findOne(
      {
        where:
        {
          postId: postId,
          userId: userId
        },
        order: {
          lastDateRead: "DESC"
        }

      }
    )
    return history
  }

  async saveHistory(post: PostEntity, user: UserEntity): Promise<HistoryEntity | any> {
    const nowDate = new Date();
    const history = await this.getByPostIdAndUserId(post.id, user.id);
    if (!history) {
      const newHistory = await this.save({
        postId: post.id,
        userId: user.id,
        lastDateRead: nowDate
      })
      return newHistory;
    }

    const oldDate = history.lastDateRead;

    const minimumMinutes = (post.content.split(' ').length - 1) / 250; // 250 word / 1 minuste
    const dateNeed = new Date(oldDate.getTime() + minimumMinutes * 60000);
    const compareDate = nowDate.getTime() < dateNeed.getTime();

    if (!history && compareDate) {
      const newHistory = await this.save({
        postId: post.id,
        userId: user.id,
        lastDateRead: nowDate
      })
      return newHistory;
    }
    return null;
  }


  private formatHistoryResponse(object: any) {
    const postsResponse = object.map(({ content, authorId, categoryId, ...postResponse }) => {
      this.changeNamePropertyObject(postResponse, '__user__', 'user');
      this.changeNamePropertyObject(postResponse, '__post__', 'post');

      delete postResponse['post']['authorId'];
      delete postResponse['post']['categoryId'];
      delete postResponse['post']['__author__']['password'];
      delete postResponse['user']['password'];
      delete postResponse['post']['content'];
      delete postResponse['userId'];
      delete postResponse['postId'];
      return postResponse;
    })
    return postsResponse;
  }

  private changeNamePropertyObject(object: any, oldName: string, newname: string) {
    object[newname] = object[oldName]
    delete object[oldName]
  }

}
