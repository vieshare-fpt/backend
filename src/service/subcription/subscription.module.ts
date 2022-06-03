import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PackageRepository } from "@repository/package.repository";
import { SubscriptionRepository } from "@repository/subscription.repository";
import { UserRepository } from "@repository/user.repository";
import { WalletRepository } from "@repository/wallet.repository";
import { SubscriptionService } from "./subscription.service";

@Module(
  {
    imports:[TypeOrmModule.forFeature([SubscriptionRepository,PackageRepository,UserRepository,WalletRepository])],
    providers: [SubscriptionService],
    exports: [SubscriptionService]
  }
)
export class SubscriptionModule{}
