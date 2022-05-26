import { PostOrderBy } from "@constant/post-oder-by.enum";
import { Role } from "@constant/role.enum";
import { Sort } from "@constant/sort.enum";
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
    const posts = await this.find(
      {
        where: {
          authorId: authorId
        },
        skip: skip || 0,
        take: take || null
      })
    const postsResponse = posts.map(({ content, ...postResponse }) => postResponse)
    return postsResponse;
  }

  async getPostsOrderBy(orderBy: PostOrderBy, sort: Sort, skip?: number, take?: number): Promise<any[]> {
    const posts = await this.find(
      {
        order: {
          [orderBy]: sort
        },
        skip: skip || 0,
        take: take || null
      });

    const postsResponse = posts.map(({ content, ...postResponse }) => postResponse)
    return postsResponse;
  }


  async getPostsByUserIdAndOrderBy(authorId: string, orderBy: PostOrderBy, sort: Sort, skip?: number, take?: number): Promise<any[]> {
    const posts = await this.find(
      {
        where: {
          authorId: authorId
        },
        order: {
          [orderBy]: sort
        },
        skip: skip || 0,
        take: take || null
      })
    const postsResponse = posts.map(({ content, ...postResponse }) => postResponse)
    return postsResponse;
  }

  async countPostsOrderBy(orderBy: PostOrderBy, sort: Sort): Promise<number> {
    const count = await this.count(
      {
        order: {
          [orderBy]: sort
        }
      });

    return count;
  }

  async countPostsByUserIdAndOrderBy(authorId: string, orderBy: PostOrderBy, sort: Sort): Promise<number> {
    const count = await this.count(
      {
        where: {
          authorId: authorId
        },
        order: {
          [orderBy]: sort
        }
      });

    return count;
  }

  async countPostsByUserId(authorId: string): Promise<number> {
    const count = await this.count(
      {
        where: {
          authorId: authorId
        }
      });

    return count;
  }


  async isAuthor(userId: string, postId) {
    return await this.count({ where: { authorId: userId, id: postId } })
  }
}
