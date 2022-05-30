import { PostOrderBy } from "@constant/post-order-by.enum";
import { Role } from "@constant/role.enum";
import { Sort } from "@constant/sort.enum";
import { PostEntity } from "@data/entity/post.entity";
import { PostsResponse } from "@data/response/posts.response";
import { EntityRepository, In, Not, Repository } from "typeorm";
import { HistoryRepository } from "./history.repository";

@EntityRepository(PostEntity)
export class PostRepository extends Repository<PostEntity>{
  async getPosts(skip?: number, take?: number): Promise<PostsResponse[]> {
    const posts = await this.find({ skip: skip || 0, take: take || null })
    const postsResponse = posts.map(({ content, ...postResponse }) => postResponse)
    return postsResponse;
  }

  async getPostsByAuthorId(authorId?: string, skip?: number, take?: number): Promise<PostsResponse[]> {
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

  async getPostsOrderBy(orderBy: PostOrderBy, sort: Sort, skip?: number, take?: number): Promise<PostsResponse[]> {
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

  async getPostsRandom(skip?: number, take?: number): Promise<PostsResponse[]> {
    const posts = await this.createQueryBuilder()
      .orderBy("RAND()")
      .skip(skip || 0)
      .take(take || null)
      .getMany();
    const postsResponse = posts.map(({ content, ...postResponse }) => postResponse)
    return postsResponse;
  }

  async getSuggestPosts(listCategoryIdReaded: string[], listPostsIdReaded: string[], skip?: number, take?: number) {
    const posts = await this.find({
      where: {
        categoryId: In(listCategoryIdReaded),
        id: Not(In(listPostsIdReaded)),

      },
      order: {
        lastUpdated: 'DESC'
      },
      skip: skip || 0,
      take: take || null
    })
    const postsResponse = posts.map(({ content, ...postResponse }) => postResponse)
    return postsResponse;

  }

  async countSuggestPosts(listCategoryIdReaded: string[], listPostsIdReaded: string[]): Promise<number> {
    const count = await this.count({
      where: {
        categoryId: In(listCategoryIdReaded),
        id: Not(In(listPostsIdReaded)),

      }
    })
    return count;
  }

  async getPostsByAuthorIdAndOrderBy(authorId: string, orderBy: PostOrderBy, sort: Sort, skip?: number, take?: number): Promise<PostsResponse[]> {
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

  async countPostsByAuthorIdAndOrderBy(authorId: string, orderBy: PostOrderBy, sort: Sort): Promise<number> {
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

  async countPostsByAuthorId(authorId: string): Promise<number> {
    const count = await this.count(
      {
        where: {
          authorId: authorId
        }
      });

    return count;
  }


  async isAuthor(authorId: string, postId) {
    return await this.count({ where: { authorId: authorId, id: postId } })
  }

}
