import { EntityRepository, FindConditions, In, Like, Repository } from 'typeorm';
import { UserEntity } from '@data/entity/user.entity';
import { Gender } from '@constant/user-gender.enum';
import { Role } from '@constant/role.enum';
import { UserOrderBy } from '@constant/user-order-by.enum';
import { Sort } from '@constant/sort.enum';
import { UserResponse } from '@data/response/user.response';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  async findByEmail(email: string): Promise<UserEntity> {
    return await this.findOne({ email });
  }

  async findAllByEmails(email: string[]): Promise<UserEntity[]> {
    return await this.find({
      where: {
        email: In(email),
      },
    });
  }

  async sumUsers(role: Role) {
    const { count } = await this.createQueryBuilder("users")
      .where("users.roles IN (:role)", { role: role })
      .select("COUNT(users.id)", "count")
      .getRawOne();
    return parseInt(count ? count : 0);
  }

  async getUsersOrderBy(where: FindConditions<UserEntity>, orderBy: UserOrderBy, sort: Sort, skip?: number, take?: number): Promise<UserResponse[] | any> {
    const order = orderBy ? { [orderBy]: sort } : {};
    const posts = await this.find(
      {
        where: where,
        order: order,
        skip: skip || 0,
        take: take || null
      });
    return posts;
  }

  async countUsers(where: FindConditions<UserEntity>): Promise<number> {
    const count = await this.count(
      {
        where: where
      });

    return count;
  }



}
