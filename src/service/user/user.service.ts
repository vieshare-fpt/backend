import { CryptStrategy } from '@service/auth/crypt.strategy';
import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterRequest } from '@data/request/register.request';
import { UserEntity } from '@data/entity/user.entity';
import { UserRepository } from '@repository/user.repository';
import { Role } from '@constant/role.enum';
import { UpdateInfoRequest } from '@data/request/update-info.request';
import { UpdatePassRequest } from '@data/request/update-pass.request';
import { EmailExistedException } from '@exception/user/email-existed.exception';
import { OldPasswordIncorrectException } from '@exception/user/old-password-not-correct.exception';
import { UserNotExistedException } from '@exception/user/user-not-existed.exception';
import { Gender } from '@constant/user-gender.enum';
import { InfoUserResponse } from '@data/response/info-user.response';
import { ChangeRoleUserRequest } from '@data/request/change-role-user.request';
import { PositionApply } from '@constant/position-apply.enum';

const MAX_RECOMMEND_USER = 15;

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private cryptStrategy: CryptStrategy,
  ) { }

  async createUser(
    request: RegisterRequest,
    isDefaultPassword: boolean,
  ): Promise<UserEntity> {
    const existedUser = await this.userRepository.findByEmail(request.email);

    if (existedUser) {
      throw new EmailExistedException();
    }

    const userEntity: UserEntity = new UserEntity();
    userEntity.name = request.name;
    userEntity.dob = request.dob;
    userEntity.gender = request.gender;
    userEntity.phone = request.phone;
    userEntity.email = request.email;
    userEntity.roles = [Role.User];
    userEntity.avatar = request.avatar;
    userEntity.password = await this.cryptStrategy.encrypt(request.password);
    userEntity.isDefaultPassword = isDefaultPassword;

    return await this.userRepository.save(userEntity);
  }

  async getUserByUserId(userId: string): Promise<UserEntity> {
    return await this.userRepository.findOne({ id: userId });
  }

  async getUsersByEmails(email: string[]): Promise<UserEntity[]> {
    return await this.userRepository.findAllByEmails(email);
  }

  async getInfoByUserId(userId: string): Promise<InfoUserResponse> {
    const userEntity = await this.getUserByUserId(userId);
    const infoUserResponse = InfoUserResponse.fromUserEntity(userEntity);

    return infoUserResponse
  }

  async updateInfo(
    userId: string,
    newInfo: UpdateInfoRequest,
  ): Promise<UserEntity> {
    return this.userRepository
      .createQueryBuilder()
      .update()
      .set({ ...newInfo })
      .where('id = :userId', { userId })
      .returning('*')
      .execute()
      .then((res) => res.raw[0]);
  }

  async updatePassword(
    userId: string,
    request: UpdatePassRequest,
  ): Promise<any> {
    const user = await this.userRepository.findOne({ id: userId });

    if (!user.isDefaultPassword)
      if (
        !(await this.cryptStrategy.check(
          request.currentPassword,
          user.password,
        ))
      ) {
        throw new OldPasswordIncorrectException();
      }

    const hashPassword = await this.cryptStrategy.encrypt(request.newPassword);
    return await this.userRepository.update(
      { id: userId },
      { password: hashPassword, isDefaultPassword: false },
    );
  }

  async getUserIdByEmail(email: string): Promise<string> {
    const existedUser = await this.userRepository.findByEmail(email);
    if (!existedUser) {
      throw new UserNotExistedException();
    }
    return existedUser.id;
  }

  async changeRoleUserRequest(changeRoleUserRequest: ChangeRoleUserRequest) {
    const userId = changeRoleUserRequest.userId;
    const existedUser = await this.userRepository.findOne({ id: userId });
    if (!existedUser) {
      throw new UserNotExistedException();
    }

    const newRole = Role[changeRoleUserRequest.newRole];
    if (!newRole) {
      throw new BadRequestException()
    }

    const changeRole = await this.userRepository.update({ id: userId }, { roles: [newRole] })
    return changeRole.affected ? true : false

  }
}
