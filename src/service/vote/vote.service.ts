import { TypePost } from "@constant/types-post.enum";
import { VoteEntity } from "@data/entity/vote.entity";
import { VoteRequest } from "@data/request/vote.request";
import { PostNotExistedException } from "@exception/post/post-not-existed.exception";
import { UserNotExistedException } from "@exception/user/user-not-existed.exception";
import { UserNotePremiumCanNotVotePostException } from "@exception/vote/user-not-premium.exception";
import { Injectable } from "@nestjs/common";
import { PostRepository } from "@repository/post.repository";
import { SubscriptionRepository } from "@repository/subscription.repository";
import { UserRepository } from "@repository/user.repository";
import { VoteRepository } from "@repository/vote.repository";


@Injectable()
export class VoteService {
  constructor(
    private voteRepository: VoteRepository,
    private userRepository: UserRepository,
    private postRepository: PostRepository,
    private subscriptionRepository: SubscriptionRepository
  ) { }
  async getVoteByPostId(postId: string) {
    return await this.voteRepository.getAverageVoteByPostId(postId);
  }

  async saveVote(userId: string, voteRequest: VoteRequest) {
    const userExisted = await this.userRepository.findOne({ id: userId });
    if (!userExisted) {
      throw new UserNotExistedException()
    }
    const postExisted = await this.postRepository.findOne({ id: voteRequest.postId })
    if (!postExisted) {
      throw new PostNotExistedException()
    }

    if (postExisted.type.includes(TypePost.Premium)) {
      const userIsPremium = await this.subscriptionRepository.isPremium(userId);
      if (!userIsPremium) {
        throw new UserNotePremiumCanNotVotePostException()
      }
    }
    const voteExisted = await this.voteRepository.findOne({ userId: userExisted.id, postId: postExisted.id })
    if (!voteExisted) {
      const voteEntity = new VoteEntity();
      voteEntity.postId = postExisted.id;
      voteEntity.userId = userExisted.id;
      voteEntity.point = voteRequest.point;
      return await this.voteRepository.save(voteEntity)
    }

    return await (await this.voteRepository.update({ id: voteExisted.id }, { point: voteRequest.point })).raw[0];
  }

  async getVotePostByUserId(userId: string, postId: string) {
    return await this.voteRepository.getVoteByPostIdAndUserId(userId, postId);
  }
}
