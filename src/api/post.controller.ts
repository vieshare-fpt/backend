import { HttpPagingResponse } from "@common/http-paging.response";
import { HttpResponse } from "@common/http.response";
import { User } from "@common/user";
import { PostOrderBy } from "@constant/post-order-by.enum";
import { Role } from "@constant/role.enum";
import { Sort } from "@constant/sort.enum";
import { TypePost } from "@constant/types-post.enum";
import { PostEntity } from "@data/entity/post.entity";
import { NewPostRequest } from "@data/request/new-post.request";
import { PagingRequest } from "@data/request/paging.request";
import { UpdatePostRequest } from "@data/request/update-post.request";
import { PostsResponse } from "@data/response/posts.response";
import { CurrentUser } from "@decorator/current-user.decorator";
import { PublicPrivate } from "@decorator/public-private.decorator";
import { Public } from "@decorator/public.decorator";
import { Roles } from "@decorator/role.decorator";
import { PostNotExistedException } from "@exception/post/post-not-existed.exception";
import { UserNotPremiumException } from "@exception/user/user-not-premium.exception";
import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { BonusStatisticService } from "@service/bonusStatistic/bonusStatistic.service";
import { HistoryService } from "@service/history/history.service";
import { PostService } from "@service/post/post.service";
import { SubscriptionService } from "@service/subcription/subscription.service";
import { UserService } from "@service/user/user.service";

@ApiTags('Post')
@Controller('api/posts')
export class PostController {
  constructor(
    private postService: PostService,
    private userSerice: UserService,
    private historyService: HistoryService,
    private subscriptionService: SubscriptionService,
    private bonusStatisticService: BonusStatisticService

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
  @ApiQuery({ name: 'category_id', type: 'string', example: 'ccff1be6-8db1-4d95-8022-41b62df5edb4', required: false })
  @ApiQuery({ name: 'per_page', type: 'number', example: 10, required: false })
  @ApiQuery({ name: 'page', type: 'number', example: 1, required: false })
  async getAllPost(
    @Query('order_by') orderBy: PostOrderBy,
    @Query('sort') sort: Sort,
    @Query('author_id') authorId: string,
    @Query('category_id') categoryId: string,
    @Query() paging: PagingRequest
  ): Promise<HttpResponse<PostsResponse[]> | HttpPagingResponse<PostsResponse[]>> {
    const postsResponse = await this.postService.getPostOrderBy(orderBy, sort, authorId, categoryId, paging.per_page, paging.page);
    return postsResponse;
  }

  @PublicPrivate()
  @ApiBearerAuth()
  @Get('suggest')
  @HttpCode(HttpStatus.OK)
  @ApiQuery({ name: 'per_page', type: 'number', example: 10, required: false })
  @ApiQuery({ name: 'page', type: 'number', example: 1, required: false })
  async getSuggestPost(
    @CurrentUser() user: User,
    @Query() paging: PagingRequest
  ): Promise<HttpResponse<PostsResponse[]> | HttpPagingResponse<PostsResponse[]>> {
    if (!user) {
      return await this.postService.suggestForAnonymus(paging.per_page, paging.page)
    }
    return await this.postService.suggestForUser(user.id, paging.per_page, paging.page)
  }



  @ApiBearerAuth()
  @PublicPrivate()
  @ApiParam({ name: 'id', type: 'string', required: true, example: 'ccff1be6-8db1-4d95-8022-41b62df5edb4' })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getPostById(
    @CurrentUser() user: User,
    @Param('id') postId: string
  ): Promise<HttpResponse<PostEntity>> {
    const post = await this.postService.getPostById(postId)
    const userExsited = user?.id ? await this.userSerice.getUserByUserId(user.id) : null;
    const isAdmin = userExsited ? userExsited.roles.includes(Role.Admin) : false;
    const isAuthor = userExsited ? await this.postService.isAuthor(user.id, postId) : false;
    const isUserPremium = userExsited ? await this.subscriptionService.checkUserIsPremium(userExsited.id) : false;
    if (!post) {
      throw new PostNotExistedException()
    }

    const isPostPremium = post.type == TypePost.Premium;


    if (isPostPremium && !isUserPremium) {
      throw new UserNotPremiumException()
    }

    if ((!isPostPremium && !userExsited) || isAuthor || isAdmin) {
      return HttpResponse.success(post)
    }

    if ((isPostPremium && isUserPremium) || !isPostPremium) {
      const saveHistory = await this.historyService.saveHistoryForUsers(postId, user.id);
      if (saveHistory) {
        await this.postService.updateViewsPost(postId);
        if (isPostPremium) {
          await this.bonusStatisticService.makeBonusStatistic(postId);
        }
      }
      return HttpResponse.success(post);
    }
    throw new BadRequestException()
  }

  @Public()
  @ApiParam({ name: 'id', type: 'string', required: true, example: 'ccff1be6-8db1-4d95-8022-41b62df5edb4' })
  @ApiQuery({ name: 'per_page', type: 'number', example: 10, required: false })
  @ApiQuery({ name: 'page', type: 'number', example: 1, required: false })
  @Get('related/:id')
  async getRelatedPosts(
    @Param('id') postId: string,
    @Query() paging: PagingRequest
  ) {
    const postExisted = await this.postService.isExisted(postId);
    if (!postExisted) {
      throw new PostNotExistedException();
    }
    const relatedPostsResponse = await this.postService.getRelatedPosts(postId, paging.per_page, paging.page);
    return relatedPostsResponse;

  }

  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: 'string', required: true, example: 'ccff1be6-8db1-4d95-8022-41b62df5edb4' })
  @Delete(':id')
  async deletePost(
    @CurrentUser() user: User,
    @Param('id') postId: string
  ) {
    const postExisted = await this.postService.isExisted(postId);
    if (!postExisted) {
      throw new PostNotExistedException()
    }
    const deletePost = await this.postService.deletePost(user, postId)
    return HttpResponse.success(deletePost);
  }


}
