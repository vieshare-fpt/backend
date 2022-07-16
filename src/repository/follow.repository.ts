import { TimeFrame } from "@constant/time-frame.enum";
import { FollowEntity } from "@data/entity/follow.entity";
import { EntityRepository, Repository } from "typeorm";


@EntityRepository(FollowEntity)
export class FollowRepository extends Repository<FollowEntity>{

  async getFollows(userId: string, skip?: number, take?: number): Promise<FollowEntity[]> {
    const follows = await this.find(
      {
        where: {
          userId: userId,
        },
        skip: skip || 0,
        take: take || null
      });

    return follows;
  }

  async countFollows(userId: string): Promise<number> {
    if (userId) return await this.count({ where: { userId: userId } });
  }


  async sumFollowsByuserId(userId: string) {
    const { count } = await this.createQueryBuilder("follows")
      .where('follows.followId = :userId', { userId })
      .select("COUNT(*)", "count")
      .getRawOne();
    return parseInt(count ? count : 0);
  }

  async statisticFollowsByWriterId(authorId: string, from: string, to: string, timeFrame: TimeFrame) {
    let group = "";
    if (timeFrame == TimeFrame.OneDay) {
      group = "DATE_FORMAT(follows.dateFollowed, '%Y-%m-%d')";
    }
    if (timeFrame == TimeFrame.OneMonth) {
      group = "DATE_FORMAT(follows.dateFollowed, '%Y-%m')";
    }
    if (timeFrame == TimeFrame.OneYear) {
      group = "DATE_FORMAT(follows.dateFollowed, '%Y')";
    }
    const statisticComments = await this.createQueryBuilder('follows')
      .where('follows.dateFollowed >= :from', { from })
      .andWhere('follows.dateFollowed <= :to', { to })
      .leftJoinAndSelect('follows.user', 'users')
      .andWhere('follows.followId = :authorId', { authorId })
      .select(group, 'date')
      .addSelect('users.roles', 'name')
      .addSelect("COUNT(*)", "value")
      .groupBy(group)
      .addGroupBy('users.roles')
      .getRawMany();

    return statisticComments;
  }

  async getListAuthorFollowsByUserId(userId: string) {
    const authorIdList = await this.createQueryBuilder('follows')
      .where('follows.userId = :userId', { userId })
      .select('follows.followId', 'followId')
      .getRawMany();
    return authorIdList;
  }
}
