import { HistoryEntity } from "@data/entity/history.entity";
import { EntityRepository, LessThan, MoreThan, Repository } from "typeorm";


@EntityRepository(HistoryEntity)
export class HistoryRepository extends Repository<HistoryEntity>{
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
      .where('history.userId = :userId',{userId : userId})
      .leftJoinAndSelect('history.post', 'post')
      .select('post.id', 'postId')
      .groupBy("post.categoryId")
      .getRawMany();

    return history;
  }

  async historyNotNullByUserId(userId: string) {
    const history = this.findOne({ where: { userId: userId } })
    if (!history) return false;
    return true

  }
}
