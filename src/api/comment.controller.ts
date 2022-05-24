import { User } from "@common/user";
import { CommentRequest } from "@data/request/comment.request";
import { CurrentUser } from "@decorator/current-user.decorator";
import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiQuery } from "@nestjs/swagger";
import { CommentService } from "@service/comment/comment.service";

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
        return await this.commentService.createComment(request.postId,user.id,request.content);
    }


}
