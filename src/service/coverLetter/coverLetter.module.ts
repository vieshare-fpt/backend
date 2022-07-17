import { CryptStrategy } from "@auth/crypt.strategy";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CoverLetterRepository } from "@repository/coverLetter.repository";
import { FollowRepository } from "@repository/follow.repository";
import { PackageRepository } from "@repository/package.repository";
import { SubscriptionRepository } from "@repository/subscription.repository";
import { UserRepository } from "@repository/user.repository";
import { WalletRepository } from "@repository/wallet.repository";
import { CommonService } from "@service/common/common.service";
import { SubscriptionService } from "@service/subcription/subscription.service";
import { UserService } from "@service/user/user.service";
import { CoverLetterService } from "./coverLetter.service";

@Module({
  imports: [TypeOrmModule.forFeature([CoverLetterRepository,UserRepository,SubscriptionRepository,PackageRepository,WalletRepository,FollowRepository])],
  providers: [CryptStrategy,CoverLetterService, CommonService,UserService,SubscriptionService],
  exports: [CoverLetterService]
})
export class CoverLetterModule { }
