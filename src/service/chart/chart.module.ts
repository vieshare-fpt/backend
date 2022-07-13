import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BonusStatisticReposiotry } from "@repository/bonusStatistic.repository";
import { CommentRepository } from "@repository/comment.repository";
import { HistoryRepository } from "@repository/history.repository";
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
      SubscriptionRepository
    ])],
    providers: [ChartService,CommonService],
    exports: [ChartService]
  }
)
export class ChartModule { }
