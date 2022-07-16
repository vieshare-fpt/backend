
import { Injectable } from '@nestjs/common';
import { FollowRepository } from '@repository/follow.repository';
import { UserRepository } from '@repository/user.repository';
import { FollowEntity } from '@data/entity/follow.entity';
import { CreateFollowRequest } from '@data/request/new-follow.request';
import { PagingRequest } from '@data/request/paging.request';
import { HttpResponse } from '@common/http.response';
import { HttpPagingResponse } from '@common/http-paging.response';
import { PagingRepsone } from '@data/response/paging.response';
import { Role } from '@constant/role.enum';
import { OnlyUserCanFollowException } from '@exception/follow/only-user-can-follow.exeption';
import { OnlyFollowWriterException } from '@exception/follow/only-can-follow-writer.exception';
import { FollowExistedException } from '@exception/follow/follow-exsited.exception';
import { FollowNotExistedException } from '@exception/follow/follow-not-existed.exception';

@Injectable()
export class FollowService {
  constructor(
    private followRepository: FollowRepository,
    private userRepositroy: UserRepository,
  ) { }

  async createFollow(
    userId: string,
    followerId: string,
  ): Promise<any> {
    const user = await this.userRepositroy.findOne({ where: { id: userId } });
    if (!user.roles.includes(Role.User) && user.roles.length <= 1) {
      throw new OnlyUserCanFollowException();
    }
    const author = await this.userRepositroy.findOne({ where: { id: followerId } });
    if (!author.roles.includes(Role.Writer)) {
      throw new OnlyFollowWriterException();
    }

    const existedFollow = await this.followRepository.findOne({
      where: {
        userId, followerId
      }
    })
    if (existedFollow) throw new FollowExistedException();

    const newFollow: FollowEntity = new FollowEntity();
    newFollow.followAt = new Date();
    newFollow.userId = userId;
    newFollow.followerId = followerId;

    return await this.followRepository.save(newFollow);
  }

  async deleteFollow(
    userId: string,
    followerId: string
  ): Promise<any> {

    const existedFollow = await this.followRepository.findOne({
      where: {
        userId, followerId
      }
    })
    if (!existedFollow) throw new FollowNotExistedException();


    const deleteFollow = await this.followRepository.delete(
      { userId, followerId }
    )

    return deleteFollow.affected ? true : false;
  }

  async getFollows(
    userID: string,
    paging: PagingRequest
  ): Promise<HttpResponse<FollowEntity[]> | HttpPagingResponse<FollowEntity[]>> {
    const page = paging.page | 1;
    const perPage = paging.per_page;
    const follows = await this.followRepository.getFollows(userID, perPage * (page - 1), perPage)
    const total = await this.followRepository.countFollows(userID);
    const totalPages = Math.ceil(total / perPage);
    const metaData = new PagingRepsone(page, perPage, total, totalPages);
    if (!perPage) {
      return HttpResponse.success(follows);
    }
    return HttpPagingResponse.success(follows, metaData);
  }

  //update
  async updateFollow(id: string) {
    return 'Return action update at ' + { id };
  }

} 
