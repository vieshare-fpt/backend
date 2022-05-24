import { HttpPagingResponse } from "@common/http-paging.response";
import { HttpResponse } from "@common/http.response";
import { User } from "@common/user";
import { Role } from "@constant/role.enum";
import { TypePost } from "@constant/types-post.enum";
import { PostEntity } from "@data/entity/post.entity";
import { NewPostRequest } from "@data/request/new-post.request";
import { UpdatePostRequest } from "@data/request/update-post.request";
import { PagingRepsone } from "@data/response/paging.response";
import { PostsResponse } from "@data/response/posts.response";
import { RegisterResponse } from "@data/response/register.response";
import { CurrentUser } from "@decorator/current-user.decorator";
import { PublicPrivate } from "@decorator/public-private.decorator";
import { Public } from "@decorator/public.decorator";
import { Roles } from "@decorator/role.decorator";
import { UserNotExistedException } from "@exception/user/user-not-existed.exception";
import { UserNotPremiumException } from "@exception/user/user-not-premium.exception";
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { PostService } from "@service/post/post.service";
import { UserService } from "@service/user/user.service";

@ApiTags('Post')
@Controller('api/posts')
export class PostController {
    constructor(
        private postService: PostService,
        private userSerice: UserService

    ) { }

    @ApiBearerAuth()
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createPost(
        @CurrentUser() user: User,
        @Body() newPost: NewPostRequest
    ): Promise<HttpResponse<PostsResponse>> {
        const post = await this.postService.createNewPost(newPost, user.id);
        return HttpResponse.success(new PostsResponse(post))
    }

    @ApiBearerAuth()
    @Patch()
    @HttpCode(HttpStatus.OK)
    async updatePost(
        @CurrentUser() user: User,
        @Body() updatePost: UpdatePostRequest
    ): Promise<HttpResponse<PostsResponse>> {
        const post = await this.postService.updatePost(updatePost, user.id);
        return HttpResponse.success(new PostsResponse(post))
    }

    @Public()
    @Get('')
    @ApiQuery({ name: 'per_page', type: 'number', example: 10, required: false })
    @ApiQuery({ name: 'page', type: 'number', example: 1, required: false })
    @HttpCode(HttpStatus.OK)
    async getPosts(
        @Query('per_page') perPage: number,
        @Query('page') page: number
    ): Promise<HttpResponse<PostsResponse[]> | HttpPagingResponse<PostsResponse[]>> {
        if (!perPage) {
            const posts = await this.postService.getPosts()
            return HttpResponse.success(posts);
        }

        const posts = await this.postService.getPosts(perPage * (page - 1), perPage)
        const total = await this.postService.countPosts();
        const totalPages = Math.ceil(total / perPage);

        const metaData = new PagingRepsone(page, perPage, total, totalPages);

        return HttpPagingResponse.success(posts, metaData);
    }

    @Public()
    @Get('/user/:id')
    @ApiParam({ name: 'id', type: 'string', required: true, example: 'ccff1be6-8db1-4d95-8022-41b62df5edb4' })
    @HttpCode(HttpStatus.OK)
    async getPostsByUserId(@Param() param): Promise<HttpResponse<PostsResponse[]>> {
        const posts = await this.postService.getPostsByUserId(param.id)
        return HttpResponse.success(posts);
    }



    @ApiBearerAuth()
    @PublicPrivate()
    @ApiParam({ name: 'id', type: 'string', required: true, example: 'ccff1be6-8db1-4d95-8022-41b62df5edb4' })
    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async getAllPostById(
        @CurrentUser() user: User,
        @Param('id') postId: string
    ): Promise<HttpResponse<PostEntity>> {
        const userExsited = user?.id ? await this.userSerice.getUserByUserId(user.id) : null;
        console.log('userExsited', userExsited)
        if (
            !userExsited
            || (userExsited.roles.length === 1
                && userExsited.roles.includes[Role.User]
                && !userExsited.isPremium
            )
        ) {
            return HttpResponse.success(await this.postService.getFreePostsById(postId));
        }


        const post = await this.postService.getPostById(postId)
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