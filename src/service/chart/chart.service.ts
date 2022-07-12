import { Role } from "@constant/role.enum";
import { TypePost } from "@constant/types-post.enum";
import { AdminTotalResponse } from "@data/response/admin-total.response";
import { TotalByPostResponse } from "@data/response/total-by-post.response";
import { TotalByUserResponse } from "@data/response/total-by-user.response";
import { Injectable } from "@nestjs/common";
import { BonusStatisticReposiotry } from "@repository/bonusStatistic.repository";
import { CommentRepository } from "@repository/comment.repository";
import { HistoryRepository } from "@repository/history.repository";
import { PostRepository } from "@repository/post.repository";
import { SubscriptionRepository } from "@repository/subscription.repository";
import { UserRepository } from "@repository/user.repository";



@Injectable()
export class ChartService {
  constructor(
    private historyRepository: HistoryRepository,
    private commentRepository: CommentRepository,
    private postRepository: PostRepository,
    private userRepository: UserRepository,
    private subscriptionRepository: SubscriptionRepository,
    private bonusStatisticReposiotry: BonusStatisticReposiotry
  ) { }
  async getAdminTotal(): Promise<AdminTotalResponse> {
    const totalViewsFree = await this.postRepository.sumViews(TypePost.Free);
    const totalViewsPremium = await this.postRepository.sumViews(TypePost.Premium);
    const totalViews = new TotalByPostResponse(totalViewsFree, totalViewsPremium);

    const totalCommentsFree = await this.commentRepository.sumComments(TypePost.Free);
    const totalCommentsPremium = await this.commentRepository.sumComments(TypePost.Premium);
    const totalComments = new TotalByPostResponse(totalCommentsFree, totalCommentsPremium);

    const totalPostsFree = await this.postRepository.sumPosts(TypePost.Free);
    const totalPostsPremium = await this.postRepository.sumPosts(TypePost.Premium);
    const totalPosts = new TotalByPostResponse(totalPostsFree, totalPostsPremium);

    ;
    const income = await this.subscriptionRepository.sumIncome();

    const totalUserFree = 12;
    const totaUserPremium = 2;
    const totalAdminsFree = await this.userRepository.sumUsers(Role.Admin);
    const totalSensorFree = await this.userRepository.sumUsers(Role.Censor);
    const totalUsers = new TotalByUserResponse(totalUserFree, totaUserPremium, totalAdminsFree, totalSensorFree);

    return new AdminTotalResponse(totalViews, totalComments, totalPosts, income, totalUsers);
  }
}
