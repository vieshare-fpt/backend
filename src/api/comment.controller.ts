import { User } from "@common/user";
import { CommentRequest } from "@data/request/comment.request";
import { PagingRequest } from "@data/request/paging.request";
import { CurrentUser } from "@decorator/current-user.decorator";
import { PublicPrivate } from "@decorator/public-private.decorator";
import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { CommentService } from "@service/comment/comment.service";

@ApiTags('Comment')
@Controller('api/comment')
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

    @ApiBearerAuth()
    @PublicPrivate()
    @Get('user/:post_id')
    @ApiParam({ name: 'author_id', type: 'string', required: true, example: 'ccff1be6-8db1-4d95-8022-41b62df5edb4' })
    @ApiQuery({ name: 'per_page', type: 'number', example: 10, required: false })
    @ApiQuery({ name: 'page', type: 'number', example: 1, required: false })
    @HttpCode(HttpStatus.OK)
    async getCommentByPostId(
        @CurrentUser() user: User,
        @Param('post_id') postId: string,
        @Query() paging: PagingRequest
    ) {
         return await this.commentService.getCommetByPostId(postId,paging.per_page,paging.page);
    }


}
