import { TimeFrame } from "@constant/time-frame.enum";
import { FollowEntity } from "@data/entity/follow.entity";
import { EntityRepository, FindConditions, Repository } from "typeorm";


@EntityRepository(FollowEntity)
export class FollowRepository extends Repository<FollowEntity>{

  async getFollows(where: FindConditions<FollowEntity>, skip?: number, take?: number): Promise<FollowEntity[]> {
    const follows = await this.find(
      {
        where,
        relations: ['user', 'follow'],
        skip: skip || 0,
        take: take || null
      });

    const formatFollowResponse = await this.formatFollowsResponse(follows);
    return formatFollowResponse;
  }

  async countFollows(where: FindConditions<FollowEntity>): Promise<number> {
    return await this.count({ where });
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

  private formatFollowsResponse(object: any) {
    const followsResponse = object.map(({ content, authorId, categoryId, ...followResponse }) => {
      this.changeNamePropertyObject(followResponse, '__follow__', 'follow');
      this.changeNamePropertyObject(followResponse, '__user__', 'user');
      delete followResponse['follow']['password'];
      delete followResponse['user']['password'];
      return followResponse;
    })
    return followsResponse;
  }

  private formatFollowResponse(object: any) {
    const { authorId, categoryId, ...followResponse } = object;
    this.changeNamePropertyObject(followResponse, '__author__', 'author');
    this.changeNamePropertyObject(followResponse, '__category__', 'category');
    delete followResponse['author']['password'];
    return followResponse;
  }
  private changeNamePropertyObject(object: any, oldName: string, newName: string) {
    object[newName] = object[oldName];
    delete object[oldName];
    return object;
  }
}
