import { HttpResponse } from "@common/http.response";
import { User } from "@common/user";
import { Role } from "@constant/role.enum";
import { TypePost } from "@constant/types-post.enum";
import { PostEntity } from "@data/entity/post.entity";
import { NewPostRequest } from "@data/request/new-post.request";
import { UpdatePostRequest } from "@data/request/update-post.request";
import { PostsResponse } from "@data/response/posts.response";
import { RegisterResponse } from "@data/response/register.response";
import { CurrentUser } from "@decorator/current-user.decorator";
import { Public } from "@decorator/public.decorator";
import { Roles } from "@decorator/role.decorator";
import { UserNotPremiumException } from "@exception/user/user-not-premium.exception";
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiParam, ApiTags } from "@nestjs/swagger";
import { PostService } from "@service/post/post.service";

@ApiTags('Post')
@Controller('api/post')
export class PostController {
    constructor(private postService: PostService) { }

    @ApiBearerAuth()
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createPost(
        @CurrentUser() user: User,
        @Body() newPost: NewPostRequest
    ): Promise<HttpResponse<RegisterResponse>> {
        const post = await this.postService.createNewPost(newPost, user.id);
        return HttpResponse.success(new RegisterResponse(post.id))
    }

    @ApiBearerAuth()
    @Patch()
    @HttpCode(HttpStatus.OK)
    async updatePost(
        @CurrentUser() user: User,
        @Body() updatePost: UpdatePostRequest
    ): Promise<HttpResponse<RegisterResponse>> {
        const post = await this.postService.updatePost(updatePost, user.id);
        return HttpResponse.success(new RegisterResponse(post))
    }

    @Public()
    @Get('')
    @HttpCode(HttpStatus.OK)
    async getPosts(): Promise<HttpResponse<PostsResponse[]>> {
        const posts = await this.postService.getPosts()
        return HttpResponse.success(posts);
    }

    @Public()
    @Get('/user/:id')
    @ApiParam({ name: 'id', type: 'string', required: true, example: 'ccff1be6-8db1-4d95-8022-41b62df5edb4' })
    @HttpCode(HttpStatus.OK)
    async getPostsByUserId(@Param() param): Promise<HttpResponse<PostsResponse[]>> {
        const posts = await this.postService.getPostsByUserId(param.id)
        return HttpResponse.success(posts);
    }


    @Public()
    @ApiParam({ name: 'id', type: 'string', required: true, example: 'ccff1be6-8db1-4d95-8022-41b62df5edb4' })
    @Get('free/:id')
    @HttpCode(HttpStatus.OK)
    async getFreePostById(@Param() param): Promise<HttpResponse<PostEntity>> {
        const post = await this.postService.getPost(param.id, [TypePost.Free])
        return HttpResponse.success(post);
    }

    @ApiBearerAuth()
    @ApiParam({ name: 'id', type: 'string', required: true, example: 'ccff1be6-8db1-4d95-8022-41b62df5edb4' })
    @Get('premium/:id')
    @HttpCode(HttpStatus.OK)
    async getAllPostById(
        @CurrentUser() user: User,
        @Param() param
    ): Promise<HttpResponse<PostEntity>> {
        if (user.roles.includes(Role.User) && !user.isPremium) {
            throw new UserNotPremiumException()
        }
        const post = await this.postService.getPost(param.id, [TypePost.Premium])
        return HttpResponse.success(post);
    }


    @ApiBearerAuth()
    @ApiParam({ name: 'id', type: 'string', required: true, example: 'ccff1be6-8db1-4d95-8022-41b62df5edb4' })
    @Delete(':id')
    async deletePost(
        @CurrentUser() user: User,
        @Param() param
    ) {
        const deletePost = await this.postService.deletePost(user, param.id)
        return HttpResponse.success(deletePost);
    }


}