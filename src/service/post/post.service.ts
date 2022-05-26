import { BadRequestException, Injectable } from "@nestjs/common";
import { PostRepository } from "@repository/post.repository";
import { NewPostRequest } from "@data/request/new-post.request"
import { PostEntity } from "@data/entity/post.entity";
import { UserRepository } from "@repository/user.repository";
import { UserNotExistedException } from "@exception/user/user-not-existed.exception";
import { UpdatePostRequest } from "@data/request/update-post.request";
import { PostNotExistedException } from "@exception/post/post-not-existed.exception";
import { UserNotAuthorPostException } from "@exception/post/user-not-author-post.exception";
import { PostsResponse } from "@data/response/posts.response";
import { TypePost } from "@constant/types-post.enum";
import { User } from "@common/user";
import { StatusPost } from "@constant/status-post.enum";
import { Role } from "@constant/role.enum";
import { UserNotPremiumException } from "@exception/user/user-not-premium.exception";
import { HttpResponse } from "@common/http.response";
import { PagingRepsone } from "@data/response/paging.response";
import { HttpPagingResponse } from "@common/http-paging.response";
import { CategoryRepository } from "@repository/category.repository";
import { CategoryNotExistedException } from "@exception/category/category-not-existed.exception";
import { PostOrderBy } from "@constant/post-oder-by.enum";
import { Sort } from "@constant/sort.enum";

@Injectable()
export class PostService {
  constructor(
    private postRepository: PostRepository,
    private userRepository: UserRepository,
    private cateRepostory: CategoryRepository
  ) { }

  async isAuthor(userId: string, postId): Promise<boolean> {
    if (!userId || !postId) {
      return false
    }
    return await this.postRepository.isAuthor(userId, postId) === 0 ? false : true
  }

  async createNewPost(
    newPostRequest: NewPostRequest,
    authorId: string
  ): Promise<PostEntity> {
    const existedUser = await this.userRepository.findOne(authorId);
    if (!existedUser) {
      throw new UserNotExistedException();
    }

    const exsitedCategory = await this.cateRepostory.isExist(newPostRequest.categoryId);
    if (!exsitedCategory) {
      throw new CategoryNotExistedException();
    }


    const postEntity: PostEntity = new PostEntity();
    postEntity.title = newPostRequest.title;
    postEntity.categoryId = newPostRequest.categoryId;
    postEntity.content = newPostRequest.content;
    postEntity.authorId = authorId;
    postEntity.description = newPostRequest.description;
    postEntity.publishDate = new Date().getTime();
    postEntity.lastUpdated = postEntity.publishDate;
    postEntity.views = 0;
    postEntity.type = newPostRequest.type;

    return await this.postRepository.save(postEntity)

  }

  async updatePost(
    updatePostRequest: UpdatePostRequest,
    authorId: string
  ): Promise<Boolean> {
    const existedPost = await this.postRepository.findOne(updatePostRequest.id)
    if (!existedPost) {
      throw new PostNotExistedException();
    }

    const existedUser = await this.userRepository.findOne(authorId);
    if (!existedUser) {
      throw new UserNotExistedException();
    }

    if (authorId !== existedPost.authorId) {
      throw new UserNotAuthorPostException();
    }

    const exsitedCategory = await this.cateRepostory.isExist(updatePostRequest.categoryId);
    if (!exsitedCategory) {
      throw new CategoryNotExistedException();
    }

    const postEntity: PostEntity = new PostEntity();
    postEntity.title = updatePostRequest.title;
    postEntity.categoryId = updatePostRequest.categoryId;
    postEntity.content = updatePostRequest.content;
    postEntity.lastUpdated = new Date().getTime();
    postEntity.type = updatePostRequest.type;

    return (await this.postRepository.update({ id: existedPost.id }, { ...existedPost, ...postEntity })).affected ? true : false
  }


  async updateViewsPost(id: string): Promise<boolean> {
    const post = await this.postRepository.findOne({ id: id })
    if (!post) {
      throw new PostNotExistedException();
    }
    const updatePost = await this.postRepository.update(id, { views: post.views + 1 })
    return updatePost.affected ? true : false;
  }

  async getFreePostsById(postId: string): Promise<PostEntity> {
    const post = await this.getPostById(postId);

    const isPremium = (post.type == TypePost.Premium)
    if (isPremium) {
      throw new UserNotPremiumException()
    }

    return post;
  }

  async getPostById(id: string): Promise<PostEntity> {
    const post = await this.postRepository.findOne({ id: id })
    return post
  }

  async countPosts(): Promise<number> {
    return await this.postRepository.count();
  }

  async getPosts(perPage: number, page: number): Promise<HttpResponse<PostsResponse[]> | HttpPagingResponse<PostsResponse[]>> {
    page = page ? page : 1;
    const posts = await this.postRepository.getPosts(perPage * (page - 1), perPage)
    const total = await this.countPosts();
    const totalPages = Math.ceil(total / perPage);
    const metaData = new PagingRepsone(page, perPage, total, totalPages);

    if (!perPage) {
      return HttpResponse.success(posts);
    }
    return HttpPagingResponse.success(posts, metaData);
  }


  async getPostsByUserId(
    authorId: string,
    perPage: number,
    page: number
  ): Promise<HttpResponse<PostsResponse[]> | HttpPagingResponse<PostsResponse[]>> {
    const author = await this.userRepository.findOne({ where: { id: authorId } });
    if (!author) {
      throw new UserNotExistedException()
    }

    page = page | 1;
    const posts = await this.postRepository.getPostsByUserId(authorId, perPage * (page - 1), perPage)
    const total = await this.postRepository.countPostsByUserId(authorId);
    const totalPages = Math.ceil(total / perPage);
    const metaData = new PagingRepsone(page, perPage, total, totalPages);

    if (!perPage) {
      return HttpResponse.success(posts);
    }
    return HttpPagingResponse.success(posts, metaData);
  }


  async deletePost(user: User, id: string): Promise<any> {
    const existedPost = await this.postRepository.findOne(id);
    if (!existedPost) {
      throw new PostNotExistedException();
    }

    if (user.roles.includes(Role.Writer) && user.id !== existedPost.authorId) {
      throw new UserNotAuthorPostException();
    }

    this.postRepository.update({ id: id }, { status: StatusPost.Delete })
  }


  async getPostOrderBy(orderBy: PostOrderBy, sort: Sort, userId: string, perPage: number, page: number): Promise<HttpResponse<PostsResponse[]> | HttpPagingResponse<PostsResponse[]>> {
    sort = sort && Sort[sort.toLocaleUpperCase()] ? Sort[sort] : Sort.ASC;
    if (!orderBy && userId) {
      return this.getPostsByUserId(userId, perPage, page);
    }

    if(!orderBy){
      return this.getPosts(perPage, page);
    }

    orderBy = PostOrderBy[orderBy];
    if (!orderBy) {
      throw new BadRequestException()
    }


    if (userId) {
      const author = await this.userRepository.findOne({ where: { id: userId } });
      if (!author) {
        throw new UserNotExistedException()
      }
      const postsResponse = await this.postRepository.getPostsByUserIdAndOrderBy(author.id, orderBy, sort, perPage * (page - 1), perPage);
      const posts = await this.postRepository.countPostsByUserIdAndOrderBy(author.id, orderBy, sort)
      const total = await this.countPosts();
      const totalPages = Math.ceil(total / perPage);
      const metaData = new PagingRepsone(page, perPage, total, totalPages);
      return HttpPagingResponse.success(postsResponse, metaData);


    }

    page = page | 1;
    const postsResponse = await this.postRepository.getPostsOrderBy(orderBy, sort, perPage * (page - 1), perPage);
    const total = await this.postRepository.countPostsOrderBy(orderBy, sort);
    const totalPages = Math.ceil(total / perPage);
    const metaData = new PagingRepsone(page, perPage, total, totalPages);
    return HttpPagingResponse.success(postsResponse, metaData);

  }


}
