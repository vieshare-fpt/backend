import { Role } from "@constant/role.enum";
import { TimeFrame } from "@constant/time-frame.enum";
import { TypePost } from "@constant/types-post.enum";
import { AdminTotalResponse } from "@data/response/admin-total.response";
import { TotalByPostResponse } from "@data/response/total-by-post.response";
import { TotalByUserResponse } from "@data/response/total-by-user.response";
import { DateInvalidException } from "@exception/chart/date-invalid.exception";
import { Injectable } from "@nestjs/common";
import { BonusStatisticReposiotry } from "@repository/bonusStatistic.repository";
import { CommentRepository } from "@repository/comment.repository";
import { HistoryRepository } from "@repository/history.repository";
import { PostRepository } from "@repository/post.repository";
import { SubscriptionRepository } from "@repository/subscription.repository";
import { UserRepository } from "@repository/user.repository";
import { CommonService } from "@service/common/common.service";
import { LessThanOrEqual, MoreThanOrEqual } from "typeorm";



@Injectable()
export class ChartService {
  constructor(
    private historyRepository: HistoryRepository,
    private commentRepository: CommentRepository,
    private postRepository: PostRepository,
    private userRepository: UserRepository,
    private subscriptionRepository: SubscriptionRepository,
    private bonusStatisticReposiotry: BonusStatisticReposiotry,
    private commonService: CommonService<any>
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

    const income = await this.subscriptionRepository.sumIncome();

    const totalUserFree = 12;
    const totaUserPremium = 2;
    const totalAdminsFree = await this.userRepository.sumUsers(Role.Admin);
    const totalSensorFree = await this.userRepository.sumUsers(Role.Censor);
    const totalUsers = new TotalByUserResponse(totalUserFree, totaUserPremium, totalAdminsFree, totalSensorFree);

    return new AdminTotalResponse(totalViews, totalComments, totalPosts, income, totalUsers);
  }


  async chartViews(from: string, to: string, timeFrame: TimeFrame): Promise<any> {
    if ((new Date(from)).toString() == 'Invalid Date' || (new Date(from)).toString() == 'Invalid Date') {
      throw new DateInvalidException()
    }
    let dateFrom = '', dateTo = '';
    if (timeFrame == TimeFrame.OneDay) {
      dateFrom = new Date(from).toISOString().slice(0, 19).replace('T', ' ');
      dateTo = (new Date(new Date(to).setHours(30, 59, 59))).toISOString().slice(0, 19).replace('T', ' ');
    }



    const statisticViews = await this.historyRepository.statisticViews(dateFrom, dateTo, timeFrame);

    const dataFormat = this.formatSatisticViewsReponse(statisticViews, dateFrom, dateTo, timeFrame);

    return dataFormat
  }

  formatSatisticViewsReponse(statisticViews: any, dateFrom: string, dateTo: string, timeFrame: TimeFrame) {
    const date = this.commonService.getDaysArrayFormat(dateFrom, dateTo, timeFrame)
    let free = [], premium = [], total = [];
    for (let index = 0; index < date.length; index++) {
      free.push(0);
      premium.push(0);
      total.push(0);

    }
    const dataFormat = [
      {
        name: 'free',
        data: free
      },
      {
        name: 'premium',
        data: premium
      },
      {
        name: 'total',
        data: total
      }
    ]



    for (let i = 0; i < statisticViews.length; i++) {
      const statisticView = statisticViews[i];

      const indexDate = date.findIndex(element => element == statisticView.date);
      if (indexDate >= 0) {
        if (statisticView.type == TypePost.Free) {
          dataFormat[0].data[indexDate] = parseInt(statisticView.views);
        }
        if (statisticView.type == TypePost.Premium) {
          dataFormat[1].data[indexDate] = parseInt(statisticView.views);
        }

        dataFormat[2].data[indexDate] = parseInt(dataFormat[0].data[indexDate] + dataFormat[1].data[indexDate]);

      }
    }
    return this.commonService.getChartResponse(dataFormat, date);
  }

}


