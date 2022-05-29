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

  async findOneAnonymousUser(): Promise<UserEntity> {
    return await this.findOne({
      where: {
        roles: [Role.Anonymous]
      },
    });
  }

  async generateAnonymousUser() {

    const userEntity: UserEntity = new UserEntity();
    userEntity.dob = '0000-00-00';
    userEntity.gender = Gender.Other;
    userEntity.roles = [Role.Anonymous];
    userEntity.password = ''
    userEntity.isDefaultPassword = false;

    return await this.save(userEntity);
  }
}
