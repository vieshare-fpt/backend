import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BonusStatisticReposiotry } from "@repository/bonusStatistic.repository";
import { CommentRepository } from "@repository/comment.repository";
import { HistoryRepository } from "@repository/history.repository";
import { PostRepository } from "@repository/post.repository";
import { UserRepository } from "@repository/user.repository";
import { ChartService } from "./chart.service";


@Module(
  {
    imports: [TypeOrmModule.forFeature([
      HistoryRepository,
      CommentRepository,
      PostRepository,
      UserRepository,
      BonusStatisticReposiotry
    ])],
    providers: [ChartService],
    exports: [ChartService]
  }
)
export class ChartModule { }
