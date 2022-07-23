import { PostOrderBy } from '@constant/post-order-by.enum';
import { Sort } from '@constant/sort.enum';
import { StatusPost } from '@constant/status-post.enum';
import { TimeFrame } from '@constant/time-frame.enum';
import { TypePost } from '@constant/types-post.enum';
import { PostEntity } from '@data/entity/post.entity';
import { UserEntity } from '@data/entity/user.entity';
import { PostsResponse } from '@data/response/posts.response';
import { EntityRepository, FindCondition, FindConditions, In, Not, Repository, SelectQueryBuilder } from 'typeorm';

@EntityRepository(PostEntity)
export class PostRepository extends Repository<PostEntity>{

  async getPost(where: FindCondition<PostEntity>) {
    const post = await this.findOne({
      where: where,
      relations: ['author', 'category']
    })
    const postResponse = this.formatPostResponse(post);
    return postResponse;
  }

  async getPosts(where: FindConditions<PostEntity>, skip?: number, take?: number): Promise<PostsResponse[] | any> {
    const posts = await this.find({
      where: where,
      relations: ['author', 'category'],
      skip: skip || 0,
      take: take || null
    })
    const postsResponse = this.formatPostsResponse(posts)
    return postsResponse;
  }

  async searchPost(key: string, skip?: number, take?: number): Promise<PostsResponse[] | any> {
    const posts = await this.createQueryBuilder("posts")
      .innerJoinAndSelect('posts.author', 'author')
      .innerJoinAndSelect('posts.category', 'category')
      .where('posts.status = :status', { status: StatusPost.Publish })
      .where("posts.title like :key", { key: `%${key}%` })
      .orWhere("author.name like :key", { key: `%${key}%` })
      .where('posts.status = :status', { status: StatusPost.Publish })
      .getMany();
    const postsResponse = this.formatPostsResponse(posts)
    return postsResponse;
  }

  _parseQueryWhereConditon(selectQueryBuilder: SelectQueryBuilder<PostEntity>, where: Object, tableName: string, haveAnd?: boolean): SelectQueryBuilder<PostEntity> {
    const listConditon = [];
    for (const property in where) {
      listConditon.push(
        { [`${tableName}.${property}`]: where[property] }
      )
    }

    let result = selectQueryBuilder;
    const length = listConditon.length;
    if (length <= 0) return selectQueryBuilder;
    listConditon.forEach((element, index) => {
      const key = Object.keys(element)[0]
      const value = element[key];
      if (index == 0 && haveAnd) {
        result = selectQueryBuilder.where(`${key} = '${value}'`);
      } else {
        result = result.andWhere(`${key} = '${value}'`);
      }
    })
    return result;
  }


  async getPostsOrderBy(where: FindConditions<PostEntity>, whereAuthor: FindCondition<UserEntity>, orderBy: PostOrderBy, sort: Sort, skip?: number, take?: number): Promise<PostsResponse[] | any> {

    let postsWhereAndJoin = this.createQueryBuilder('posts')
      .innerJoinAndSelect('posts.author', 'author')
      .innerJoinAndSelect('posts.category', 'category');
    postsWhereAndJoin = this._parseQueryWhereConditon(postsWhereAndJoin, where, 'posts', true)
    postsWhereAndJoin = this._parseQueryWhereConditon(postsWhereAndJoin, whereAuthor, 'author')
    if (orderBy) {
      postsWhereAndJoin = postsWhereAndJoin.orderBy(`posts.${orderBy}`, sort)
    }
    const posts = await postsWhereAndJoin
      .skip(skip || 0)
      .take(take || null)
      .getMany();

    const postsResponse = this.formatPostsResponse(posts)
    return postsResponse;

  }
  async getPostsFollowerOrderBy(where: FindConditions<PostEntity>, whereAuthor: FindCondition<UserEntity>, listAuthor: Array<string>, orderBy: PostOrderBy, sort: Sort, skip?: number, take?: number): Promise<PostsResponse[] | any> {
    if (listAuthor.length == 0) return [];
    let postsWhereAndJoin = this.createQueryBuilder('posts')
      .innerJoinAndSelect('posts.author', 'author')
      .innerJoinAndSelect('posts.category', 'category');
    postsWhereAndJoin = this._parseQueryWhereConditon(postsWhereAndJoin, where, 'posts', true)
    postsWhereAndJoin = this._parseQueryWhereConditon(postsWhereAndJoin, whereAuthor, 'author')
    if (orderBy) {
      postsWhereAndJoin = postsWhereAndJoin.orderBy(`posts.${orderBy}`, sort)
    }
    const posts = await postsWhereAndJoin
      .andWhere("author.id IN(:...ids)", { ids: [...listAuthor] })
      .skip(skip || 0)
      .take(take || null)
      .getMany();

    const postsResponse = this.formatPostsResponse(posts)
    return postsResponse;

  }
  async getPostsRandom(skip?: number, take?: number): Promise<PostsResponse[] | any> {
    const posts = await this.createQueryBuilder('posts')
      .innerJoinAndSelect('posts.author', 'author')
      .innerJoinAndSelect('posts.category', 'category')
      .where('posts.status = :status', { status: StatusPost.Publish })
      .orderBy('RAND()')
      .skip(skip || 0)
      .take(take || null)
      .getMany();
    const postsResponse = this.formatPostsResponse(posts)
    return postsResponse;
  }

  async getSuggestPosts(listCategoryIdReaded: string[], listPostsIdReaded: string[], listAuthorFollowByUserId: string[], skip?: number, take?: number) {
    const posts = await this.find({
      where: {
        authorId: In(listAuthorFollowByUserId),
        categoryId: In(listCategoryIdReaded),
        id: Not(In(listPostsIdReaded)),
        status: StatusPost.Publish
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

  async sumViews(typePost: TypePost) {
    const { sum } = await this.createQueryBuilder("posts")
      .where("posts.type = :typePost", { typePost })
      .select("SUM(posts.views)", "sum")
      .getRawOne();
    return parseInt(sum ? sum : 0);
  }

  async sumViewsByUserId(userId: string, typePost: TypePost) {
    const { sum } = await this.createQueryBuilder("posts")
      .where("posts.type = :typePost", { typePost })
      .andWhere('posts.authorId = :userId', { userId })
      .select("SUM(posts.views)", "sum")
      .getRawOne();
    return parseInt(sum ? sum : 0);
  }

  async sumPosts(typePost: TypePost) {
    const { count } = await this.createQueryBuilder("posts")
      .where("posts.type = :typePost", { typePost })
      .select("COUNT(posts.id)", "count")
      .getRawOne();
    return parseInt(count ? count : 0);
  }

  async sumPostsByUserId(userId: string, typePost: TypePost) {
    const { count } = await this.createQueryBuilder("posts")
      .where("posts.type = :typePost", { typePost })
      .andWhere('posts.authorId = :userId', { userId })
      .select("COUNT(posts.id)", "count")
      .getRawOne();
    return parseInt(count ? count : 0);
  }

  async countSuggestPosts(listCategoryIdReaded: string[], listPostsIdReaded: string[], listAuthorFollowByUserId: string[]): Promise<number> {
    const count = await this.count({
      where: {
        authorId: In(listAuthorFollowByUserId),
        categoryId: In(listCategoryIdReaded),
        id: Not(In(listPostsIdReaded)),
        status: StatusPost.Publish
      }
    })
    return count;
  }

  async getRelatedPosts(post: PostEntity, skip?: number, take?: number): Promise<PostsResponse[] | any> {
    const cateId = (await post.category).id;
    const relatedPosts = await this.createQueryBuilder('posts')
      .innerJoinAndSelect('posts.author', 'author')
      .innerJoinAndSelect('posts.category', 'category')
      .where('posts.categoryId = :categoryId', { categoryId: cateId })
      .andWhere('posts.id != :id', { id: post.id })
      .andWhere('posts.status = :status', { status: StatusPost.Publish })
      .orderBy('RAND()')
      .skip(skip || 0)
      .take(take || null)
      .getMany();

    const postsResponse = this.formatPostsResponse(relatedPosts)
    return postsResponse;
  }


  async countRelatedPosts(post: PostEntity): Promise<number> {
    const cateId = (await post.category).id;
    const count = await this.createQueryBuilder('posts')
      .where('posts.categoryId = :categoryId', { categoryId: cateId })
      .andWhere('posts.id != :id', { id: post.id })
      .andWhere('posts.status = :status', { status: StatusPost.Publish })
      .getCount();

    return count;
  }


  async countPosts(where: FindConditions<PostEntity>, whereAuthor: FindCondition<UserEntity>): Promise<number> {
    let postsWhereAndJoin = this.createQueryBuilder('posts')
      .innerJoinAndSelect('posts.author', 'author')
      .innerJoinAndSelect('posts.category', 'category');
    postsWhereAndJoin = this._parseQueryWhereConditon(postsWhereAndJoin, where, 'posts', true)
    postsWhereAndJoin = this._parseQueryWhereConditon(postsWhereAndJoin, whereAuthor, 'author')

    const count = await postsWhereAndJoin

      .getCount();


    return count;
  }
  async countPostsFollower(where: FindConditions<PostEntity>, whereAuthor: FindCondition<UserEntity>, listAuthor: Array<string>): Promise<number> {
    if (listAuthor.length == 0) return 0;
    let postsWhereAndJoin = this.createQueryBuilder('posts')
      .innerJoinAndSelect('posts.author', 'author')
      .innerJoinAndSelect('posts.category', 'category');
    postsWhereAndJoin = this._parseQueryWhereConditon(postsWhereAndJoin, where, 'posts', true)
    postsWhereAndJoin = this._parseQueryWhereConditon(postsWhereAndJoin, whereAuthor, 'author')

    const count = await postsWhereAndJoin
      .andWhere("author.id IN(:...ids)", { ids: [...listAuthor] })
      .getCount();


    return count;
  }

  async isAuthor(authorId: string, postId: string) {
    return await this.count({ where: { authorId: authorId, id: postId } })
  }

  private formatPostsResponse(object: any) {
    const postsResponse = object.map(({ content, authorId, categoryId, ...postResponse }) => {
      this.changeNamePropertyObject(postResponse, '__author__', 'author');
      this.changeNamePropertyObject(postResponse, '__category__', 'category');
      delete postResponse['author']['password'];
      return postResponse;
    })
    return postsResponse;
  }

  private formatPostResponse(object: any) {
    const { authorId, categoryId, ...postResponse } = object;
    this.changeNamePropertyObject(postResponse, '__author__', 'author');
    this.changeNamePropertyObject(postResponse, '__category__', 'category');
    delete postResponse['author']['password'];
    return postResponse;
  }
  private changeNamePropertyObject(object: any, oldName: string, newName: string) {
    object[newName] = object[oldName];
    delete object[oldName];
    return object;
  }


  async statisticPosts(from: string, to: string, timeFrame: TimeFrame) {
    let group = "";
    if (timeFrame == TimeFrame.OneDay) {
      group = "DATE_FORMAT(publishDate, '%Y-%m-%d')";
    }
    if (timeFrame == TimeFrame.OneMonth) {
      group = "DATE_FORMAT(publishDate, '%Y-%m')";
    }
    if (timeFrame == TimeFrame.OneYear) {
      group = "DATE_FORMAT(publishDate, '%Y')";
    }
    const statisticPosts = await this.createQueryBuilder('posts')
      .where('posts.publishDate >= :from', { from })
      .andWhere('posts.publishDate <= :to', { to })
      .select(group, 'date')
      .addSelect('posts.type', 'name')
      .addSelect('COUNT(*)', 'value')
      .groupBy(group)
      .addGroupBy('posts.type')
      .getRawMany();

    return statisticPosts;
  }

  async statisticPostsByWriterId(authorId: string, from: string, to: string, timeFrame: TimeFrame) {
    let group = "";
    if (timeFrame == TimeFrame.OneDay) {
      group = "DATE_FORMAT(publishDate, '%Y-%m-%d')";
    }
    if (timeFrame == TimeFrame.OneMonth) {
      group = "DATE_FORMAT(publishDate, '%Y-%m')";
    }
    if (timeFrame == TimeFrame.OneYear) {
      group = "DATE_FORMAT(publishDate, '%Y')";
    }
    const statisticPosts = await this.createQueryBuilder('posts')
      .where('posts.publishDate >= :from', { from })
      .andWhere('posts.publishDate <= :to', { to })
      .andWhere('posts.authorId = :authorId', { authorId })
      .select(group, 'date')
      .addSelect('posts.type', 'name')
      .addSelect('COUNT(*)', 'value')
      .groupBy(group)
      .addGroupBy('posts.type')
      .getRawMany();

    return statisticPosts;
  }
}
