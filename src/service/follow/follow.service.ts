
import { Injectable } from '@nestjs/common';
import { FollowRepository } from '@repository/follow.repository';
import { UserRepository } from '@repository/user.repository';
import { FollowEntity } from '@data/entity/follow.entity';
import { CreateFollowRequest } from '@data/request/new-follow.request';
import { PagingRequest } from '@data/request/paging.request';
import { HttpResponse } from '@common/http.response';
import { HttpPagingResponse } from '@common/http-paging.response';
import { PagingRepsone } from '@data/response/paging.response';
import { FollowThemselvesException } from '@exception/follow/user-follow-themselves.exception';
import { FollowExistedException } from '@exception/follow/follow-existed.exception';
import { FollowNotExistedException } from '@exception/follow/follow-not-existed.exception';

@Injectable()
export class FollowService {
    constructor(
        private followRepository: FollowRepository,
    ) {}

    async createFollow(
        userID: string,
        createFollowReq: CreateFollowRequest,
    ): Promise<any> {
        const isValid = await this.followRepository.checkValidFollows(userID);
        if (!isValid) {
            throw new FollowThemselvesException();
        }
        const existedFollow = await this.followRepository.findOne({
            where: {
                userID: userID,
                createFollowReq: CreateFollowRequest,
            }
        })
        if (existedFollow) throw new FollowExistedException();

        const newFollow: FollowEntity = new FollowEntity();
        newFollow.follow_at = new Date();
        newFollow.user_id = userID;
        newFollow.follower_id = createFollowReq.followerID;

        return await this.followRepository.save(newFollow);
    }

    async deleteFollow(
        user_id: string,
        follower_id: string
    ): Promise<any> {

        const existedFollow = await this.followRepository.findOne({
            where: {
                userID: user_id,
                createFollowReq: CreateFollowRequest,
            }
        })

        if(!existedFollow) throw new FollowNotExistedException();

        const deleteFollow = await this.followRepository.
            createQueryBuilder().
            where('userID =: userid, followerID =: followerid',
                { userid: user_id, followerid: follower_id }).execute();
        return deleteFollow;
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
