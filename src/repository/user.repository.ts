import { EntityRepository, In, Like, Repository } from 'typeorm';
import { UserEntity } from '@data/entity/user.entity';
import { Gender } from '@constant/user-gender.enum';
import { Role } from '@constant/role.enum';

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
    return parseInt(count);
  }

}
