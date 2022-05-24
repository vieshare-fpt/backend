import { PostEntity } from "@data/entity/post.entity";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(PostEntity)
export class PostRepository extends Repository<PostEntity>{
    async getPosts(skip?: number, take?: number): Promise<any[]> {
        const posts = await this.find({ skip: skip || 0, take: take || null })
        const postsResponse = posts.map(({ content, ...postResponse }) => postResponse)
        return postsResponse;
    }

    async getPostsByUserId(authorId?: string, skip?: number, take?: number): Promise<any[]> {
        const posts = await this.find({ where: { authorId: authorId }, skip: skip || 0, take: take || null })
        const postsResponse = posts.map(({ content, ...postResponse }) => postResponse)
        return postsResponse;
    }

    async isAuthor(userId: string, postId: string) {
        return await this.count({ where: { authorId: userId, id: postId } })
    }
}