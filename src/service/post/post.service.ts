import { BadRequestException, Injectable } from "@nestjs/common";
import { PostRepository } from "@repository/post.repository";
import { NewPostRequest } from "@data/request/new-post.request"
import { PostEntity } from "@data/entity/post.entity";
import { UserRepository } from "@repository/user.repository";
import { AuthorNotExistedException, UserNotExistedException } from "@exception/user/user-not-existed.exception";
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
import { HttpPagingResponse } from "@common/http-paging.response";
import { CategoryRepository } from "@repository/category.repository";
import { CategoryNotExistedException } from "@exception/category/category-not-existed.exception";
import { PostOrderBy } from "@constant/post-order-by.enum";
import { Sort } from "@constant/sort.enum";
import { HistoryRepository } from "@repository/history.repository";
import { CommonService } from "@service/common/common.service";
import { FollowRepository } from "@repository/follow.repository";
import { FindCondition } from "typeorm";
import { UserNotAuthorizedException } from "@exception/user/user-not-authorizated.exception";
import { UserEntity } from "@data/entity/user.entity";
import { BonusStatisticEntity } from "@data/entity/bonus-statistic.entity";
import { BonusFormulaReposiotry } from "@repository/bonusFormula.repository";
import { BonusStatisticReposiotry } from "@repository/bonusStatistic.repository";


@Injectable()
export class PostService {
  constructor(
    private postRepository: PostRepository,
    private userRepository: UserRepository,
    private cateRepostory: CategoryRepository,
    private historyRepository: HistoryRepository,
    private followRepository: FollowRepository,
    private commonService: CommonService<PostEntity | PostsResponse | any>,
    private bonusFormulaRepository: BonusFormulaReposiotry,
    private bonusStatisticRepository: BonusStatisticReposiotry
  ) { }
  randomDate(start: any, end: any) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }
  async fakeData() {
    const formula = await this.bonusFormulaRepository.findOne({ isActive: true });

    const freeUser = [
      "00ab2110-954f-4388-85d3-9cf457afa0cd",
      "01f4cb39-9808-4a3f-a806-c4c25ad28042",
      "02375d5a-9692-40c3-8ff5-34554fc31257",
      "034bed8d-0322-4bcc-9b7b-080e3f5f6433",
      "1360b2bb-1fd1-48a5-a1bf-f90e97a58312",
      "1ad09f46-299a-4eb3-834f-70a69c31996c",
      "244c3b7d-69cc-4f09-901e-ad6b0d8dcf3f",
      "25a84666-118f-4faf-93ee-5fd05521d17f",
      "27f47929-ed57-496c-877a-3acc0e4c3a71",
      "315732ef-97f9-4907-995f-60e20918d54f",
      "3202483d-70c8-4037-a8f6-d5eb00672c67",
      "423cb6da-19c8-47fe-9349-a9fc10c8af81",
      "4caab920-bd3b-4b8a-b748-f4ba3c2deb78",
      "52f103c7-f5ed-4500-827f-53f40d6fdac7",
      "57cece1f-4645-414c-9122-feb7184e46a1",
      "5e8f68bc-8637-48d1-acb4-53d456f7a2fa",
      "61f8b6aa-1210-49ab-aa55-42dfb5cf08cc",
      "62020a68-c54f-4c1c-9ccb-1fdfbe6954ff",
      "63ac4c33-969c-45bc-87a3-c9b83c3e4ad5",
      "854900e2-5985-41bd-9ad5-6592b004f77a",
      "86d861a6-ed8e-4c47-a5c2-d8cd6166f8cb",
      "896e7128-dc48-48c7-8124-7d9f5b110eba",
      "8a539737-8acd-4a4a-8e20-5e92f54efc09",
      "99907f43-0823-4f2e-9ed6-ca1fb3b52059",
      "b4184982-d3e7-4373-abf9-e43efca0eb3a",
      "b5cb40fd-d1c6-4805-ad61-907a3aaec80c",
      "c4898f00-8a0c-4006-b16d-70b0cb49a0ad",
      "d3be1af0-c6ed-490f-810c-2550a212740e",
      "e876e4a9-fcfa-4f77-b77f-fa22f1252044",
      "ed72a2b3-b443-46b0-91dd-2056ae3204a6",
      "eff4fecb-b48b-483d-90e0-71e4e5fb3194",
      "f6cda6ee-7a90-4149-ac63-0d1b85b5ae49",
      "f7fc6456-328d-4d4b-81ef-b9235bf7495b",
      "f877bb88-1efb-4622-b8bf-59989a6f8182"
    ]
    const premiumUser = [
      "63ac4c33-969c-45bc-87a3-c9b83c3e4ad5",
      "27f47929-ed57-496c-877a-3acc0e4c3a71",
      "1ad09f46-299a-4eb3-834f-70a69c31996c",
      "b5cb40fd-d1c6-4805-ad61-907a3aaec80c",
      "f6cda6ee-7a90-4149-ac63-0d1b85b5ae49"
    ]
    const freePost = [
      "0228eac4-493e-42b0-bdad-6a4749ae87be",
      "074ec305-eb78-4173-942a-aa0cc5b7096a",
      "0c094045-1d7e-4afe-9363-59d2b1f549ca",
      "0cdc8dd6-9db5-4ed2-8c8f-e2142be90694",
      "0d4051b1-ad91-4a2b-8fa3-e7d36e03daac",
      "0d45d778-59f4-4a98-a7cd-f6198b91e9d8",
      "0deb4e48-15a3-4c45-82dd-72164c1eedf9",
      "0eb2c89c-9376-41fd-b21c-fd0d79cdd9aa",
      "1254ddca-0d1e-478e-ae89-0aa8dabf5acf",
      "153b1eb7-d281-40de-ab4f-2369403e9da2",
      "15ca7faf-8a16-4274-b8f0-b767c06bd20e",
      "16eee68e-c5ca-42e1-b9b1-e9d186775939",
      "1fd31d99-ec79-4dcb-94cb-61f9d6e59c9c",
      "2fd74ab6-ce5b-48ff-bad2-e79f88ddf964",
      "3f9f061f-79a1-4b12-8452-69e235a7e269",
      "3fe48c4b-5914-4582-a3a9-528c1e577415",
      "405a7771-2850-41b6-bb53-ff4bd88fa9f6",
      "45038a5a-6540-424f-a349-268ee7929869",
      "45903833-83ab-43e5-98af-8ad5aeaaa955",
      "45dff91f-0da9-419b-a2be-0e2a17502caf",
      "4ceb20ea-a393-4083-9335-059534f60049",
      "544ec533-ddf4-4282-9a1d-0fbb5db26bec",
      "54cfcc50-7a73-4970-a119-2cda48e3d399",
      "5789e435-01f6-4619-b011-d18547bf3dd0",
      "5c65559d-f33d-4fb6-b3b2-869963a3b718",
      "5c695678-0f79-46fc-a3f9-d7f8566b6c25",
      "6670e9dd-fa15-4cf3-afe5-bd66c3136e69",
      "70424b64-7ff8-40ff-a2f7-0b65dd496307",
      "753013af-d5f1-4c77-ab21-aafaba466d44",
      "7608b57f-985b-4d91-86f2-ac3d45f2f7e4",
      "777bb01e-5178-44fd-94bb-aaecf23aa6ea",
      "7b4b58b5-a133-45bc-b1b3-099dcf450b62",
      "7c918379-639c-4f02-899f-1223c99b1d02",
      "835dce02-c383-474a-87a8-8de826ddb7a1",
      "914a2b28-aae2-4b1c-93ce-c316a0bfd5e1",
      "9274606c-c635-4544-ba5a-8468f4a54927",
      "9bcb7d1c-ef7e-446e-9ffd-35c070a5a521",
      "9e5d3bd9-23ed-4a77-947b-fef34f846880",
      "9f38ab6f-af9b-4bcd-b27b-709e7b4b9b77",
      "a4ce931b-df84-43cc-8044-ffc1580665e0",
      "a884031d-65d2-48b3-9137-648cbd2ba163",
      "ab67a14b-f690-4506-be60-d7ed48479f03",
      "af0bf589-0a32-4ac4-8a0f-60b46037b663",
      "b2c24a25-f9ed-4871-9061-262f38b60d2d",
      "b9f7eba1-6d09-4d8d-b2f2-f7669e53f39f",
      "bf2fcbf6-76a6-40cc-b37e-13832138d54a",
      "c26f233b-30b8-40bb-83b1-b358c5a72ba0",
      "c8d99aeb-b5c0-481c-ad44-c35423434865",
      "cb14103b-c7a8-4812-aa00-7b09b3a3ee12",
      "ce927801-1557-4366-a08e-bd8adb751e22",
      "d10e36ae-4580-4f3e-84b6-4d46175f8505",
      "d7d7d0f7-c751-454d-84e3-06b68d6b802e",
      "d7f2ba72-fba8-45a3-8183-b1faf071692b",
      "d81f31cf-dc2f-49ab-9cbd-28ef908e800c",
      "dc332993-7e9e-4d15-9324-ea07b2254174",
      "def38896-bff2-4c0b-ac94-524b1e8fa2ed",
      "df5c7b87-d617-4361-b639-7badd112cf08",
      "e05d93b0-7905-492b-9ece-6ba3f5450951",
      "ea56cd71-6693-44d7-ab25-0cdf9fbc9178",
      "f003a5df-4f1f-4d0f-8a83-f7bb3f118376",
      "f51b30ca-82dc-4dd3-86db-7596e5be5607",
      "f9c7fd32-2ff8-4a99-bf79-00922bb504dd"
    ]
    const premiumPost = [
      "011fe30a-07da-4130-8d3f-46dc15ab5b42",
      "0401e59f-75ea-4e6b-99b4-eb930de2926c",
      "09217d65-0bef-4ca6-8a74-241d71f08dd9",
      "14094bd1-3a3e-4374-8bb0-8b10d2289a20",
      "1bbdfe1e-b750-463b-84bc-7b95a2a582e3",
      "1c2d10cf-3773-4b23-8f1e-739e15521b8e",
      "1d73b191-f928-4d92-8224-1b57114e58c7",
      "20099317-9813-43f8-8742-497963d69c88",
      "26315e3c-aedc-4d27-8814-085a1da24c54",
      "3de0fdd0-2588-49b0-bb0a-8f970a57598e",
      "4858e8e0-2534-43bb-a1c5-bdb9bbc82092",
      "4b53cb63-0558-4e2f-86c7-25409b29d9de",
      "4eec74a4-1023-402d-b949-75eb087c1b92",
      "56f3b817-18ce-46f2-a6e7-16387bb79389",
      "5c6283a7-07cb-4404-998f-29379c7d6047",
      "90ca1244-4440-42a7-9a08-ad795580f2c8",
      "927812fa-0f05-45fc-9a71-c69778ba228b",
      "a4e66011-ac71-49d3-9c80-05c4bbe2c601",
      "afe791c5-1f1b-4de8-a0f6-908d684f6dab",
      "b315b611-2582-415c-95ae-3b82839a6ef1",
      "b5ddea69-84fe-4d75-99c8-41c17412ccff",
      "be51ddd9-8356-40e6-aa23-63a985e79c38",
      "c700d869-893f-414f-b3d3-a9964c22338e",
      "d11ced93-09d9-4b84-bcdf-bc009012ad19"
    ]
    for (const postId of freePost) {
      const date = (await this.postRepository.findOne({ where: { id: postId } })).publishDate;
      if (!date) continue;
      for (const userId of freeUser) {
        if (Math.random() < 0.5) {
          await this.historyRepository.save({
            userId,
            postId,
            lastDateRead: this.randomDate(date, new Date())
          });
          await this.updateViewsPost(postId);
        }
      }
    }
    for (const postId of premiumPost) {
      const date = (await this.postRepository.findOne({ where: { id: postId } })).publishDate;
      if (!date) continue;
      for (const userId of premiumUser) {
        const readDate = this.randomDate(date, new Date())
        if (Math.random() < 0.8) {
          await this.updateViewsPost(postId);
          await this.historyRepository.save({
            userId,
            postId,
            lastDateRead: readDate
          });
         


          const nowDate = readDate;
          const nowMonth = nowDate.getMonth();
          const nowYear = nowDate.getFullYear();
          const fromDate = new Date(nowYear, nowMonth, 1);
          const toDate = new Date(nowYear, nowMonth + 1, 0);


          const bonusStatisticEntityExited: any = await this.bonusStatisticRepository.findOne({
            where: {
              postId: postId,
              to: toDate
            }
          })

          if (bonusStatisticEntityExited) {
            await this.bonusStatisticRepository.update(
              {
                id: bonusStatisticEntityExited.id
              },
              {
                views: bonusStatisticEntityExited.views + 1
              }
            )
          } else {
            const newBonusStatisticEntity = new BonusStatisticEntity();
            newBonusStatisticEntity.postId = postId;
            newBonusStatisticEntity.from = fromDate;
            newBonusStatisticEntity.to = toDate;
            newBonusStatisticEntity.bonusFormulaId = formula.id;
            newBonusStatisticEntity.views = 1;
            await this.bonusStatisticRepository.save(newBonusStatisticEntity)
          }

        }
      }
    }
    return true
  }


  async isAuthor(userId: string, postId: string): Promise<boolean> {
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
    postEntity.thumbnail = newPostRequest.thumbnail;
    postEntity.content = newPostRequest.content;
    postEntity.authorId = authorId;
    postEntity.description = newPostRequest.description;
    postEntity.publishDate = new Date();
    postEntity.lastUpdated = postEntity.publishDate;
    postEntity.views = 0;
    postEntity.type = newPostRequest.type;
    postEntity.status = newPostRequest.status ? newPostRequest.status : StatusPost.Draft;

    return await this.postRepository.save(postEntity)

  }

  async updatePost(
    postId: string,
    updatePostRequest: UpdatePostRequest,
    authorId: string
  ): Promise<Boolean> {
    const existedPost = await this.postRepository.findOne(postId)
    if (!existedPost) {
      throw new PostNotExistedException();
    }

    const existedUser = await this.userRepository.findOne(authorId);
    if (!existedUser) {
      throw new UserNotExistedException();
    }
    const isAuthor = authorId == existedPost.authorId;
    const isCensor = existedUser.roles.includes(Role.Censor);
    if (!isAuthor && !isCensor) {
      throw new UserNotAuthorizedException();

    }

    const exsitedCategory = await this.cateRepostory.isExist(updatePostRequest.categoryId);
    if (updatePostRequest.categoryId != undefined && !exsitedCategory) {
      throw new CategoryNotExistedException();
    }


    return (
      await this.postRepository.update(
        { id: existedPost.id },
        { ...existedPost, ...updatePostRequest, lastUpdated: new Date() })
    ).affected ? true : false
  }


  async updateViewsPost(postId: string): Promise<boolean> {
    const post = await this.getPostById({ id: postId });
    if (!post) {
      throw new PostNotExistedException();
    }
    const updatePost = await this.postRepository.update({ id: postId }, { views: post.views + 1 })
    return updatePost.affected ? true : false;
  }


  async getPostById(where: FindCondition<PostEntity>, authorWhere?: FindCondition<UserEntity>): Promise<any> {
    const post = await this.postRepository.getPost(where, authorWhere)
    return post;

  }

  async searchPost(key: string, perPage: number, page: number) {
    page = page ? page : 1;
    const post = await this.postRepository.searchPost(key, perPage * (page - 1), perPage);
    const total = await this.postRepository.countSearchPost(key);
    return this.commonService.getPagingResponse(post, perPage, page, total)

  }



  async isExisted(postId: string): Promise<boolean> {
    return (await this.postRepository.countPosts({ id: postId }, {})) > 0 ? true : false;
  }

  async getRelatedPosts(postId: string, perPage: number, page: number) {
    const post = await this.getPostById({ id: postId });

    if (!post) {
      throw new PostNotExistedException();
    }
    page = page ? page : 1;
    const relatedPostsResponse = await this.postRepository.getRelatedPosts(post, perPage * (page - 1), perPage);
    const total = await this.postRepository.countRelatedPosts(post);
    return this.commonService.getPagingResponse(relatedPostsResponse, perPage, page, total)
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


  async getPostOrderBy(userId: string, status: StatusPost, orderBy: PostOrderBy, sort: Sort, authorId: string, categoryId: string, perPage: number, page: number): Promise<HttpResponse<PostsResponse[]> | HttpPagingResponse<PostsResponse[]>> {
    sort = sort && Sort[sort.toLocaleUpperCase()] ? Sort[sort] : Sort.ASC;
    page = page ? page : 1;
    status = status == StatusPost.All ? undefined : status;
    orderBy = PostOrderBy[orderBy];
    const userExsited = await this.userRepository.findOne({ where: { id: userId } });
    let isAuthor = false;
    let authorIsDelete = false;
    if (userExsited) {
      isAuthor = userExsited.roles.includes(Role.Writer) ? true : false;
    }
    if (isAuthor) {
      authorId = userExsited.id;
      authorIsDelete = undefined;
    }
    if (authorId) {
      const author = await this.userRepository.findOne({ where: { id: authorId, } });
      if (!author) {
        throw new AuthorNotExistedException()
      }
    }
    if (categoryId) {
      const category = await this.cateRepostory.findOne({ where: { id: categoryId } });
      if (!category) {
        throw new CategoryNotExistedException();
      }
    }


    const where = await this.commonService.removeUndefined(
      {
        authorId,
        categoryId,
        status,

      }
    )


    const postsResponse = await this.postRepository.getPostsOrderBy(where, { isDelete: authorIsDelete }, orderBy, sort, perPage * (page - 1), perPage);
    const total = await this.postRepository.countPosts(where, { isDelete: authorIsDelete });
    return this.commonService.getPagingResponse(postsResponse, perPage, page, total)

  }
  async getPostFollowOrderBy(userId: string, status: StatusPost, orderBy: PostOrderBy, sort: Sort, categoryId: string, perPage: number, page: number): Promise<HttpResponse<PostsResponse[]> | HttpPagingResponse<PostsResponse[]>> {
    sort = sort && Sort[sort.toLocaleUpperCase()] ? Sort[sort] : Sort.ASC;
    page = page ? page : 1;
    status = status == StatusPost.All ? undefined : status;
    orderBy = PostOrderBy[orderBy];
    const userExsited = await this.userRepository.findOne({ where: { id: userId } });
    let authorIsDelete = false;
    const follows = await this.followRepository.find({
      where: {
        userId: userExsited.id
      }
    })
    const listAuthor = [];
    follows.forEach(item => { listAuthor.push(item.followId) });


    if (categoryId) {
      const category = await this.cateRepostory.findOne({ where: { id: categoryId } });
      if (!category) {
        throw new CategoryNotExistedException();
      }
    }


    const where = await this.commonService.removeUndefined(
      {
        categoryId,
        status,

      }
    )


    const postsResponse = await this.postRepository.getPostsFollowerOrderBy(where, { isDelete: authorIsDelete }, listAuthor, orderBy, sort, perPage * (page - 1), perPage);
    const total = await this.postRepository.countPostsFollower(where, { isDelete: authorIsDelete }, listAuthor);
    return this.commonService.getPagingResponse(postsResponse, perPage, page, total)

  }
  async suggestForAnonymus(perPage: number, page: number): Promise<HttpResponse<PostsResponse[]> | HttpPagingResponse<PostsResponse[]>> {
    page = page ? page : 1;
    const postsResponse = await this.postRepository.getPostsRandom(perPage * (page - 1), perPage)
    const total = await this.postRepository.countPosts({ status: StatusPost.Publish }, {});
    return this.commonService.getPagingResponse(postsResponse, perPage, page, total)
  }

  async suggestForUser(userId: string, perPage: number, page: number): Promise<HttpResponse<PostsResponse[]> | HttpPagingResponse<PostsResponse[]>> {
    const userExsited = await this.userRepository.findOne({ id: userId });
    if (!userExsited) {
      throw new UserNotExistedException();
    }

    const postsIdReadedByUserId = await this.historyRepository.getPostsIdReadedByUserId(userId);
    const listPostsIdReaded = postsIdReadedByUserId.map((item: any) => item.postId)
    if (postsIdReadedByUserId.length == 0) {
      return await this.suggestForAnonymus(perPage, page)
    }
    const categoryReadMostByUserId = await this.historyRepository.getCategoryReadMostByUserId(userId);
    const listCategoryIdReaded = categoryReadMostByUserId.map((item: any) => item.categoryId);

    const listAuthorFollowByUserId = await this.followRepository.getListAuthorFollowsByUserId(userId);

    const postsResponse = await this.postRepository.getSuggestPosts(listCategoryIdReaded, listPostsIdReaded, listAuthorFollowByUserId, perPage * (page - 1), perPage)
    const total = await this.postRepository.countSuggestPosts(listCategoryIdReaded, listPostsIdReaded, listAuthorFollowByUserId);
    if (postsResponse.length <= 10) {
      return await this.suggestForAnonymus(perPage, page)
    }
    return this.commonService.getPagingResponse(postsResponse, perPage, page, total)
  }


}
