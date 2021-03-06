import { ChartName } from "@constant/chart-name.enum";
import { Role } from "@constant/role.enum";
import { TimeFrame } from "@constant/time-frame.enum";
import { TypePost } from "@constant/types-post.enum";
import { AdminTotalResponse } from "@data/response/admin-total.response";
import { TotalByPostResponse } from "@data/response/total-by-post.response";
import { TotalByUserResponse } from "@data/response/total-by-user.response";
import { WriterTotalResponse } from "@data/response/writer-total.response";
import { DateInvalidException } from "@exception/chart/date-invalid.exception";
import { BadRequestException, Injectable } from "@nestjs/common";
import { BonusStatisticReposiotry } from "@repository/bonusStatistic.repository";
import { CommentRepository } from "@repository/comment.repository";
import { FollowRepository } from "@repository/follow.repository";
import { HistoryRepository } from "@repository/history.repository";
import { PackageRepository } from "@repository/package.repository";
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
    private packageRepository: PackageRepository,
    private followRepository: FollowRepository,
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


    const totalUser = await this.userRepository.sumUsers(Role.User);;
    const totalUserPremium = await this.subscriptionRepository.countPremiumUser();
    const totalUserFree = totalUser - totalUserPremium;
    const totalWriter = await this.userRepository.sumUsers(Role.Writer);
    const totalAdmin = await this.userRepository.sumUsers(Role.Admin);
    const totalSensor = await this.userRepository.sumUsers(Role.Censor);
    const totalUsers = new TotalByUserResponse(totalUserFree, totalUserPremium, totalWriter, totalAdmin, totalSensor);
    return new AdminTotalResponse(totalViews, totalComments, totalPosts, income, totalUsers);
  }

  async getWriterTotal(userId: string): Promise<any> {
    const totalViewsFree = await this.postRepository.sumViewsByUserId(userId, TypePost.Free);
    const totalViewsPremium = await this.postRepository.sumViewsByUserId(userId, TypePost.Premium);
    const totalViews = new TotalByPostResponse(totalViewsFree, totalViewsPremium);

    const totalCommentsFree = await this.commentRepository.sumCommentsByUserId(userId, TypePost.Free);
    const totalCommentsPremium = await this.commentRepository.sumCommentsByUserId(userId, TypePost.Premium);
    const totalComments = new TotalByPostResponse(totalCommentsFree, totalCommentsPremium);

    const totalPostsFree = await this.postRepository.sumPostsByUserId(userId, TypePost.Free);
    const totalPostsPremium = await this.postRepository.sumPostsByUserId(userId, TypePost.Premium);
    const totalPosts = new TotalByPostResponse(totalPostsFree, totalPostsPremium);

    const totalIncomes = await this.bonusStatisticReposiotry.sumBonusByUserId(userId);

    const totalFollows = await this.followRepository.sumFollowsByuserId(userId);

    return new WriterTotalResponse(totalViews, totalViews, totalPosts, totalIncomes, totalFollows)

  }


  async chartForAdmin(from: string, to: string, timeFrame: TimeFrame, chartName: ChartName): Promise<any> {
    if ((new Date(from)).toString() == 'Invalid Date' || (new Date(from)).toString() == 'Invalid Date') {
      throw new DateInvalidException()
    }
    let dateFrom = '', dateTo = '';
    if (timeFrame == TimeFrame.OneDay) {
      dateFrom = new Date(from).toISOString().slice(0, 19).replace('T', ' ');
      dateTo = (new Date(new Date(to).setHours(23 + 7, 59, 59))).toISOString().slice(0, 19).replace('T', ' ');
    }
    if (timeFrame == TimeFrame.OneMonth) {
      dateFrom = new Date(new Date(from).getFullYear(), new Date(from).getMonth(), 1, 7, 0, 0).toISOString().slice(0, 19).replace('T', ' ');
      dateTo = new Date(new Date(to).getFullYear(), new Date(to).getMonth() + 1, 0, 23 + 7, 59, 59).toISOString().slice(0, 19).replace('T', ' ');
    }
    if (timeFrame == TimeFrame.OneYear) {
      dateFrom = new Date(new Date(from).getFullYear(), 0, 1, 7, 0, 0).toISOString().slice(0, 19).replace('T', ' ');
      dateTo = new Date(new Date(to).getFullYear(), 11, 31, 23 + 7, 59, 59).toISOString().slice(0, 19).replace('T', ' ');
    }
    let statistic = null;
    let listDataName = null;

    if (chartName == ChartName.Views) {
      statistic = await this.historyRepository.statisticViews(dateFrom, dateTo, timeFrame);
      listDataName = await this.getArrayNameInStatistic(statistic, [TypePost.Free, TypePost.Premium]);
    }

    if (chartName == ChartName.Posts) {
      statistic = await this.postRepository.statisticPosts(dateFrom, dateTo, timeFrame);
      listDataName = await this.getArrayNameInStatistic(statistic, [TypePost.Free, TypePost.Premium]);
    }

    if (chartName == ChartName.Comments) {
      statistic = await this.commentRepository.statisticComments(dateFrom, dateTo, timeFrame);
      listDataName = await this.getArrayNameInStatistic(statistic, [TypePost.Free, TypePost.Premium]);
    }

    if (chartName == ChartName.Packages) {
      statistic = await this.subscriptionRepository.statisticPackages(dateFrom, dateTo, timeFrame);
      const packages = (await this.packageRepository.getPackges()).map(element => element.name);
      listDataName = await this.getArrayNameInStatistic(statistic, packages);
    }

    if (chartName == ChartName.Incomes) {
      statistic = await this.subscriptionRepository.statisticIncomes(dateFrom, dateTo, timeFrame);
      const packages = (await this.packageRepository.getPackges()).map(element => element.name);
      listDataName = await this.getArrayNameInStatistic(statistic, packages);
    }

    if (chartName == null || listDataName == null) {
      throw new BadRequestException()
    }
    const statisticIncomesFormat = await this.formatStatisticResponse(statistic, listDataName, dateFrom, dateTo, timeFrame, chartName);
    return statisticIncomesFormat;
  }

  async chartForWriter(userId: string, from: string, to: string, timeFrame: TimeFrame, chartName: ChartName): Promise<any> {
    if ((new Date(from)).toString() == 'Invalid Date' || (new Date(from)).toString() == 'Invalid Date') {
      throw new DateInvalidException()
    }
    let dateFrom = '', dateTo = '';
    if (timeFrame == TimeFrame.OneDay) {
      dateFrom = new Date(from).toISOString().slice(0, 19).replace('T', ' ');
      dateTo = (new Date(new Date(to).setHours(23 + 7, 59, 59))).toISOString().slice(0, 19).replace('T', ' ');
    }
    if (timeFrame == TimeFrame.OneMonth) {
      dateFrom = new Date(new Date(from).getFullYear(), new Date(from).getMonth(), 1, 7, 0, 0).toISOString().slice(0, 19).replace('T', ' ');
      dateTo = new Date(new Date(to).getFullYear(), new Date(to).getMonth() + 1, 0, 23 + 7, 59, 59).toISOString().slice(0, 19).replace('T', ' ');
    }
    if (timeFrame == TimeFrame.OneYear) {
      dateFrom = new Date(new Date(from).getFullYear(), 0, 1, 7, 0, 0).toISOString().slice(0, 19).replace('T', ' ');
      dateTo = new Date(new Date(to).getFullYear(), 11, 31, 23 + 7, 59, 59).toISOString().slice(0, 19).replace('T', ' ');
    }
    let statistic = null;
    let listDataName = null;

    if (chartName == ChartName.Views) {
      statistic = await this.historyRepository.statisticViewsByWriterId(userId, dateFrom, dateTo, timeFrame);
      listDataName = await this.getArrayNameInStatistic(statistic, [TypePost.Free, TypePost.Premium]);
    }

    if (chartName == ChartName.Posts) {
      statistic = await this.postRepository.statisticPostsByWriterId(userId, dateFrom, dateTo, timeFrame);
      listDataName = await this.getArrayNameInStatistic(statistic, [TypePost.Free, TypePost.Premium]);
    }

    if (chartName == ChartName.Comments) {
      statistic = await this.commentRepository.statisticCommentsByWriterId(userId, dateFrom, dateTo, timeFrame);
      listDataName = await this.getArrayNameInStatistic(statistic, [TypePost.Free, TypePost.Premium]);
    }

    if (chartName == ChartName.Incomes) {
      statistic = await this.bonusStatisticReposiotry.statisticBounsByWriterId(userId, dateFrom, dateTo, timeFrame);
      listDataName = await this.getArrayNameInStatistic(statistic, [TypePost.Free, TypePost.Premium]);
    }

    if (chartName == ChartName.Follows) {
      statistic = await this.followRepository.statisticFollowsByWriterId(userId, dateFrom, dateTo, timeFrame);
      listDataName = await this.getArrayNameInStatistic(statistic, [Role.User, Role.Writer, Role.Censor, Role.Admin]);
    }

    if (chartName == null || listDataName == null) {
      throw new BadRequestException()
    }
    const statisticIncomesFormat = await this.formatStatisticResponse(statistic, listDataName, dateFrom, dateTo, timeFrame, chartName);
    return statisticIncomesFormat;
  }




  private async getArrayNameInStatistic(statisticPackages: any, initArr: any) {

    const arr = [];
    initArr.forEach((element: any) => {
      const index = statisticPackages.findIndex((e: any) => e.name == element);
      if (index >= 0) arr.push(element);
    })
    return arr;
  }

  private async formatStatisticResponse(statisticPackages: any, listDataName: any, dateFrom: string, dateTo: string, timeFrame: TimeFrame, chartName: ChartName) {
    const date = this.commonService.getDaysArrayFormat(dateFrom, dateTo, timeFrame);


    const arrZero = [];
    for (let index = 0; index < date.length; index++) {
      arrZero.push(0);

    }
    let dataFormat = [];
    listDataName.forEach(element => {
      dataFormat.push({
        name: element,
        data: [...arrZero]
      })
    })
    dataFormat.push({
      name: 'total',
      data: [...arrZero]
    })
    const lastIndex = dataFormat.length - 1;

    for (let i = 0; i < statisticPackages.length; i++) {
      const statisticPackage = statisticPackages[i];

      const indexDate = date.findIndex(element => element == statisticPackage.date);
      if (indexDate < 0) continue;
      const indexName = dataFormat.findIndex(element => element.name == statisticPackage.name);
      if (indexName < 0) continue;
      dataFormat[indexName].data[indexDate] = parseInt(statisticPackage.value);

      dataFormat[lastIndex].data[indexDate] += dataFormat[indexName].data[indexDate];


    }
    return this.commonService.getChartResponse(dataFormat, date, chartName);
  }
}


