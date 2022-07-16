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
import { UserOrderBy } from '@constant/user-order-by.enum';
import { Sort } from '@constant/sort.enum';
import { UserResponse } from '@data/response/user.response';
import { CommonService } from '@service/common/common.service';
import { SubscriptionService } from '@service/subcription/subscription.service';
import { UpdateUserRequest } from '@data/request/update-user.request';

const MAX_RECOMMEND_USER = 15;

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private cryptStrategy: CryptStrategy,
    private commonService: CommonService<UserEntity | UserResponse | any>,
    private subscriptionService: SubscriptionService
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
  async getListsUsers(orderBy: UserOrderBy, sort: Sort, roles: Role, isdelete: string, perPage: number, page: number) {
    sort = sort && Sort[sort.toLocaleUpperCase()] ? Sort[sort] : Sort.ASC;
    page = page ? page : 1;
    const isDelete = isdelete == 'true' ? true : isdelete == 'false' ? false : undefined;
    orderBy = UserOrderBy[orderBy];
    const where = await this.commonService.removeUndefined({ isDelete, roles });
    const users = await this.userRepository.getUsersOrderBy(where, orderBy, sort, perPage * (page - 1), perPage);
    const total = await this.userRepository.countUsers(where);
    const usersResponse = await Promise.all(users.map(async (user: UserEntity) => {
      const isPremium = await this.subscriptionService.checkUserIsPremium(user.id);
      return UserResponse.formatUserEntity(user, isPremium);
    }))

    return this.commonService.getPagingResponse(usersResponse, perPage, page, total)

  }

  async getUserByUserId(userId: string): Promise<UserEntity> {
    return await this.userRepository.findOne({ id: userId });
  }

  async getUsersByEmails(email: string[]): Promise<UserEntity[]> {
    return await this.userRepository.findAllByEmails(email);
  }

  async getInfoByUserId(userId: string): Promise<InfoUserResponse> {
    const userEntity = await this.getUserByUserId(userId);
    const infoUserResponse = InfoUserResponse.formatEntity(userEntity);

    return infoUserResponse
  }

  async updateInfo(
    userId: string,
    newInfo: UpdateInfoRequest,
  ): Promise<boolean> {
    return (await this.userRepository.update({ id: userId }, { ...newInfo })).affected ? true : false;
  }

  async updateUser(
    userId: string,
    updateUser: UpdateUserRequest,
  ): Promise<boolean> {
    return (await this.userRepository.update({ id: userId }, { ...updateUser })).affected ? true : false;
  }

  async updateAvatar(
    userId: string,
    newAvatar: string,
  ): Promise<boolean> {
    return (await this.userRepository.update({ id: userId }, { avatar: newAvatar })).affected ? true : false;
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
