
import { Injectable } from '@nestjs/common';
import { FollowRepository } from '@repository/follow.repository';
import { UserRepository } from '@repository/user.repository';
import { FollowEntity } from '@data/entity/follow.entity';
import { CreateFollowRequest } from '@data/request/new-follow.request';
import { PagingRequest } from '@data/request/paging.request';
import { HttpResponse } from '@common/http.response';
import { HttpPagingResponse } from '@common/http-paging.response';
import { PagingRepsone } from '@data/response/paging.response';

@Injectable()
export class FollowService{

    constructor(
        private followRepository: FollowRepository,
        private userRepository: UserRepository,
    ) {}

    async createFollow(
        createFollowReq: CreateFollowRequest,
    ): Promise<any> {
        const newFollow: FollowEntity = new FollowEntity();
        newFollow.follow_at = new Date();
        newFollow.userID = createFollowReq.userId;
        newFollow.followerID = createFollowReq.followerID;

        return await this.followRepository.save(newFollow);
    }

    async deleteFollow(
        id: string,
    ): Promise<any> {
        return await this.followRepository.delete(id);
    }

    async getFollows(
        userID: string,
        paging: PagingRequest
    ) : Promise<HttpResponse<FollowEntity[]> | HttpPagingResponse<FollowEntity[]>> {
        const page = paging.page| 1;
        const perPage = paging.per_page;
        const follows = await this.followRepository.getFollows(perPage * (page - 1), perPage)
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
        return 'Return action update at ' + {id};
    }

} 
