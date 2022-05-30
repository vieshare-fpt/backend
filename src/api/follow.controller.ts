import { HttpPagingResponse } from '@common/http-paging.response';
import { HttpResponse } from '@common/http.response';
import { User } from '@common/user';
import { CreateFollowRequest } from '@data/request/new-follow.request';
import { PagingRequest } from '@data/request/paging.request';
import { FollowResponse } from '@data/response/follow.response';
import { CurrentUser } from '@decorator/current-user.decorator';
import { Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FollowService } from '@service/follow/follow.service';
import { UpdateResult } from 'typeorm';

@ApiTags('Follow')
@Controller('api/follows')
export class FollowController {
    constructor(
        private followService: FollowService) { }

    @ApiBearerAuth()
    @Get('')
    @ApiQuery({ name: 'per_page', type: 'number', example: 10, required: false })
    @ApiQuery({ name: 'page', type: 'number', example: 1, required: false })
    @HttpCode(HttpStatus.OK)
    async getFollows(
        @CurrentUser() user: User,
        @Query() paging: PagingRequest
    ): Promise<HttpResponse<FollowResponse[]> | HttpPagingResponse<FollowResponse[]>> {
        return await this.followService.getFollows(user.id, paging);
    }

    @ApiBearerAuth()
    @Delete('/:follower_id')
    @ApiQuery({ name: 'follower_id', type: 'string', required: true })
    @HttpCode(HttpStatus.OK)
    async deleteFollow(
        @CurrentUser() user: User,
        @Param('follow_id') follower_id: string,
    ): Promise<HttpResponse<UpdateResult>> {
        const deleteFollow = await this.followService.deleteFollow(user.id, follower_id);
        return HttpResponse.success(deleteFollow);
    }

    @Post()
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    async createFollow(
        @Query() followReq: CreateFollowRequest,
        @CurrentUser() user: User
    ) {
        return await this.followService.createFollow(user.id, followReq);
    }

    
}
