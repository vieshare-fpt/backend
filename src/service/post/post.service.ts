import { Injectable } from "@nestjs/common";
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
import { Equal, Not } from "typeorm";
@Injectable()
export class PostService {
    constructor(
        private postRepository: PostRepository,
        private userRepository: UserRepository
    ) { }

    async createNewPost(
        newPostRequest: NewPostRequest,
        authorId: string
    ): Promise<PostEntity> {
        const existedUser = await this.userRepository.findOne(authorId);
        if (!existedUser) {
            throw new UserNotExistedException();
        }


        // Code check exsited category

        const postEntity: PostEntity = new PostEntity();
        postEntity.title = newPostRequest.title;
        postEntity.categoryId = newPostRequest.categoryId;
        postEntity.content = newPostRequest.content;
        postEntity.authorId = authorId;
        postEntity.publishDate = new Date().getTime();
        postEntity.lastUpdated = postEntity.publishDate;
        postEntity.views = 0;
        postEntity.type = newPostRequest.type;

        return await this.postRepository.save(postEntity)

    }

    async updatePost(
        updatePostRequest: UpdatePostRequest,
        authorId: string
    ): Promise<any> {
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


        // Code check exsited category

        const postEntity: PostEntity = new PostEntity();
        postEntity.title = updatePostRequest.title;
        postEntity.categoryId = updatePostRequest.categoryId;
        postEntity.content = updatePostRequest.content;
        postEntity.lastUpdated = new Date().getTime();
        postEntity.type = updatePostRequest.type;

        return await this.postRepository.update({ id: existedPost.id }, { ...existedPost, ...postEntity })
    }

    async getPost(id: string, typePost: TypePost[]): Promise<PostEntity> {

        const post = await this.postRepository.findOne({ id: id })
        if (!post || !typePost.includes(post.type)) {
            throw new PostNotExistedException();
        }
        return post
    }




    async getPosts(): Promise<any> {
        const posts = await this.postRepository.find()
        const postsResponse = posts.map(({ content, ...postResponse }) => postResponse)
        return postsResponse;
    }

    async getPostsByUserId(authorId: string): Promise<any> {
        const author = await this.userRepository.findOne({ where: { id: authorId } });
        if(!author){
            throw new UserNotExistedException()
        }
        
        const posts = await this.postRepository.find({ where: { authorId: author.id } })
        const postsResponse = posts.map(({ content, ...postResponse }) => postResponse)
        return postsResponse;
    }


    async deletePost(user: User, id: string): Promise<any> {
        const existedPost = await this.postRepository.findOne(id);
        if (!existedPost) {
            throw new PostNotExistedException();
        }

        if (user.roles.includes(Role.Creator) && user.id !== existedPost.authorId) {
            throw new UserNotAuthorPostException();
        }

        this.postRepository.update({ id: id }, { status: StatusPost.Delete })
    }
}
