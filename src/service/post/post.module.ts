
import { CryptStrategy } from "@auth/crypt.strategy";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BonusFormulaReposiotry } from "@repository/bonusFormula.repository";
import { BonusStatisticReposiotry } from "@repository/bonusStatistic.repository";
import { CategoryRepository } from "@repository/category.repository";
import { FollowRepository } from "@repository/follow.repository";
import { HistoryRepository } from "@repository/history.repository";
import { PackageRepository } from "@repository/package.repository";
import { PostRepository } from "@repository/post.repository";
import { SubscriptionRepository } from "@repository/subscription.repository";
import { UserRepository } from "@repository/user.repository";
import { WalletRepository } from "@repository/wallet.repository";
import { CommonService } from "@service/common/common.service";
import { SubscriptionService } from "@service/subcription/subscription.service";
import { UserService } from "@service/user/user.service";
import { PostService } from "./post.service";

@Module({
  imports: [TypeOrmModule.forFeature([
    UserRepository,
    PostRepository,
    CategoryRepository,
    HistoryRepository,
    SubscriptionRepository,
    PackageRepository,
    WalletRepository,
    FollowRepository,
    BonusFormulaReposiotry,
    BonusStatisticReposiotry
  ])],
  providers: [CryptStrategy, PostService, UserService, SubscriptionService, CommonService],
  exports: [PostService]
})
export class PostModule { }
