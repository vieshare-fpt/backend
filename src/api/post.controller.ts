import { HttpPagingResponse } from "@common/http-paging.response";
import { HttpResponse } from "@common/http.response";
import { User } from "@common/user";
import { PostOrderBy } from "@constant/post-order-by.enum";
import { Role } from "@constant/role.enum";
import { Sort } from "@constant/sort.enum";
import { PostEntity } from "@data/entity/post.entity";
import { NewPostRequest } from "@data/request/new-post.request";
import { PagingRequest } from "@data/request/paging.request";
import { UpdatePostRequest } from "@data/request/update-post.request";
import { PostsResponse } from "@data/response/posts.response";
import { CurrentUser } from "@decorator/current-user.decorator";
import { PublicPrivate } from "@decorator/public-private.decorator";
import { Roles } from "@decorator/role.decorator";
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
  @Roles(Role.Writer)
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
  ): Promise<HttpResponse<Boolean>> {
    const post = await this.postService.updatePost(updatePost, user.id);
    return HttpResponse.success(post)
  }

  @PublicPrivate()
  @Get('')
  @HttpCode(HttpStatus.OK)
  @ApiQuery({ name: 'order_by', type: 'enum', enum: PostOrderBy, example: PostOrderBy.views, required: false })
  @ApiQuery({ name: 'sort', type: 'enum', enum: Sort, example: Sort.DESC, required: false })
  @ApiQuery({ name: 'author_id', type: 'string', example: 'ccff1be6-8db1-4d95-8022-41b62df5edb4', required: false })
  @ApiQuery({ name: 'per_page', type: 'number', example: 10, required: false })
  @ApiQuery({ name: 'page', type: 'number', example: 1, required: false })
  async getAllPostTopViews(
    @Query('order_by') orderBy: PostOrderBy,
    @Query('sort') sort: Sort,
    @Query('author_id') authorId: string,
    @Query() paging: PagingRequest
  ): Promise<HttpResponse<PostsResponse[]> | HttpPagingResponse<PostsResponse[]>> {
    const postsResponse = await this.postService.getPostOrderBy(orderBy, sort, authorId, paging.per_page, paging.page);
    return postsResponse;
  }


  @ApiBearerAuth()
  @PublicPrivate()
  @ApiParam({ name: 'postId', type: 'string', required: true, example: 'ccff1be6-8db1-4d95-8022-41b62df5edb4' })
  @Patch('view/:postId')
  @HttpCode(HttpStatus.OK)
  async updateViewsPost(
    @CurrentUser() user: User,
    @Param('postId') postId: string,
  ): Promise<HttpResponse<any>> {
    const post = await this.postService.updateViewsPost(postId);
    return HttpResponse.success(post)
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
    const idAdmin = userExsited ? userExsited.roles.includes(Role.Admin) : false;
    const isAuthor = userExsited ? await this.postService.isAuthor(user.id, postId) : false;
    const isPremium = userExsited ? userExsited.isPremium : false;

    if (!userExsited || !(idAdmin || isAuthor || isPremium)) {
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
