import { HttpPagingResponse } from "@common/http-paging.response";
import { HttpResponse } from "@common/http.response";
import { User } from "@common/user";
import { CommentEntity } from "@data/entity/comment.entity";
import { CommentRequest } from "@data/request/comment.request";
import { PagingRequest } from "@data/request/paging.request";
import { CurrentUser } from "@decorator/current-user.decorator";
import { PublicPrivate } from "@decorator/public-private.decorator";
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { CommentService } from "@service/comment/comment.service";
import { UpdateResult } from "typeorm";

@ApiTags('Comment')
@Controller('api/comments')
export class CommentController {
    constructor(
        private commentService: CommentService
    ) { }

    @ApiBearerAuth()
    @Post()
    @HttpCode(HttpStatus.OK)
    async commentPost(
        @CurrentUser() user: User,
        @Body() request: CommentRequest
    ) {
        return await this.commentService.createComment(request.postId, user.id, request.content);
    }

    @PublicPrivate()
    @Get('')
    @ApiQuery({ name: 'per_page', type: 'number', example: 10, required: false })
    @ApiQuery({ name: 'page', type: 'number', example: 1, required: false })
    @HttpCode(HttpStatus.OK)
    async getComments(
        @Query() paging: PagingRequest
    ): Promise<HttpResponse<CommentEntity[]> | HttpPagingResponse<CommentEntity[]>> {
        return await this.commentService.getCommets(paging);
    }

    @PublicPrivate()
    @Get('post/:post_id')
    @ApiParam({ name: 'post_id', type: 'string', required: true, example: 'ccff1be6-8db1-4d95-8022-41b62df5edb4' })
    @ApiQuery({ name: 'per_page', type: 'number', example: 10, required: false })
    @ApiQuery({ name: 'page', type: 'number', example: 1, required: false })
    @HttpCode(HttpStatus.OK)
    async getCommentsByPostId(
        @Param('post_id') postId: string,
        @Query() paging: PagingRequest
    ): Promise<HttpResponse<CommentEntity[]> | HttpPagingResponse<CommentEntity[]>> {
        return await this.commentService.getCommetsByPostId(postId, paging);
    }

    @ApiBearerAuth()
    @ApiParam({ name: 'comment_id', type: 'string', required: true, example: 'ccff1be6-8db1-4d95-8022-41b62df5edb4' })
    @Delete('/:comment_id')
    @HttpCode(HttpStatus.OK)
    async deleteComment(
        @CurrentUser() user: User,
        @Param('comment_id') comment_id: string
    ): Promise<HttpResponse<UpdateResult>> {
        const deleteComment = await this.commentService.deleteComment(user, comment_id)
        return HttpResponse.success(deleteComment);
    }


}
