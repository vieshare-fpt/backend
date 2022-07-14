import { FollowController } from "@api/follow.controller";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BonusStatisticReposiotry } from "@repository/bonusStatistic.repository";
import { CommentRepository } from "@repository/comment.repository";
import { FollowRepository } from "@repository/follow.repository";
import { HistoryRepository } from "@repository/history.repository";
import { PackageRepository } from "@repository/package.repository";
import { PostRepository } from "@repository/post.repository";
import { SubscriptionRepository } from "@repository/subscription.repository";
import { UserRepository } from "@repository/user.repository";
import { CommonService } from "@service/common/common.service";
import { ChartService } from "./chart.service";


@Module(
  {
    imports: [TypeOrmModule.forFeature([
      HistoryRepository,
      CommentRepository,
      PostRepository,
      UserRepository,
      BonusStatisticReposiotry,
      SubscriptionRepository,
      PackageRepository,
      FollowRepository
    ])],
    providers: [ChartService,CommonService],
    exports: [ChartService]
  }
)
export class ChartModule { }
