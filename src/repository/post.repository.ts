import { PostOrderBy } from '@constant/post-order-by.enum';
import { Sort } from '@constant/sort.enum';
import { PostEntity } from '@data/entity/post.entity';
import { PostsResponse } from '@data/response/posts.response';
import { AppException } from '@exception/app.exception';
import { EntityRepository, FindConditions, In, Not, Repository } from 'typeorm';

@EntityRepository(PostEntity)
export class PostRepository extends Repository<PostEntity>{
  async getPosts(where: FindConditions<PostEntity>, skip?: number, take?: number): Promise<PostsResponse[] | any> {
    const posts = await this.find({
      where: where,
      skip: skip || 0,
      take: take || null
    })
    const postsResponse = posts.map(({ content, authorId, categoryId, ...postResponse }) => {
      this.changeNamePropertyObject(postResponse, '__author__', 'author');
      this.changeNamePropertyObject(postResponse, '__category__', 'category');
      delete postResponse['author']['password']
      return postResponse;
    })
    return postsResponse;
  }


  async getPostsOrderBy(where: FindConditions<PostEntity>, orderBy: PostOrderBy, sort: Sort, skip?: number, take?: number): Promise<PostsResponse[] | any> {
    const posts = await this.find(
      {
        where: where,
        order: {
          [orderBy]: sort
        },
        relations: ['author', 'category'],
        skip: skip || 0,
        take: take || null
      });
    const postsResponse = this.formatPostsResponse(posts)
    return postsResponse;

  }

  async getPostsRandom(skip?: number, take?: number): Promise<PostsResponse[] | any> {
    const posts = await this.createQueryBuilder('posts')
      .innerJoinAndSelect('posts.author', 'author')
      .innerJoinAndSelect('posts.category', 'category')
      .orderBy('RAND()')
      .skip(skip || 0)
      .take(take || null)
      .getMany();
    const postsResponse = this.formatPostsResponse(posts)
    return postsResponse;
  }

  async getSuggestPosts(listCategoryIdReaded: string[], listPostsIdReaded: string[], skip?: number, take?: number) {
    const posts = await this.find({
      where: {
        categoryId: In(listCategoryIdReaded),
        id: Not(In(listPostsIdReaded)),

      },
      relations: ['author', 'category'],
      order: {
        lastUpdated: 'DESC'
      },
      skip: skip || 0,
      take: take || null
    })
    const postsResponse = this.formatPostsResponse(posts)
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

  async getRelatedPosts(post: PostEntity, skip?: number, take?: number): Promise<PostsResponse[] | any> {
    const relatedPosts = await this.createQueryBuilder('posts')
      .innerJoinAndSelect('posts.author', 'author')
      .innerJoinAndSelect('posts.category', 'category')
      .where('posts.categoryId = :categoryId', { categoryId: post.categoryId })
      .andWhere('posts.id != :id', { id: post.id })
      .orderBy('RAND()')
      .skip(skip || 0)
      .take(take || null)
      .getMany();
    const postsResponse = this.formatPostsResponse(relatedPosts)
    return postsResponse;
  }


  async countRelatedPosts(post: PostEntity): Promise<number> {
    const count = await this.createQueryBuilder('posts')
      .where('posts.categoryId = :categoryId', { categoryId: post.categoryId })
      .andWhere('posts.id != :id', { id: post.id })
      .getCount();

    return count;
  }


  async countPosts(where: FindConditions<PostEntity>): Promise<number> {
    const count = await this.count(
      {
        where: where
      });

    return count;
  }


  async isAuthor(authorId: string, postId: string) {
    return await this.count({ where: { authorId: authorId, id: postId } })
  }

  private formatPostsResponse(object: any) {
    const postsResponse = object.map(({ content, authorId, categoryId, ...postResponse }) => {
      this.changeNamePropertyObject(postResponse, '__author__', 'author');
      this.changeNamePropertyObject(postResponse, '__category__', 'category');
      delete postResponse['author']['password']
      return postResponse;
    })
    return postsResponse;
  }
  private changeNamePropertyObject(object: any, oldName: string, newname: string) {
    object[newname] = object[oldName]
    delete object[oldName]
    return true
  }

}
