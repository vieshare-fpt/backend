import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '@repository/user.repository';
import { UserService } from '@service/user/user.service';
import { AuthModule } from '@service/auth/auth.module';
import { CryptStrategy } from '@service/auth/crypt.strategy';
import { WalletService } from '@service/wallet/wallet.service';
import { WalletRepository } from '@repository/wallet.repository';
import { WalletModule } from '@service/wallet/wallet.module';
import { CommonService } from '@service/common/common.service';
import { SubscriptionService } from '@service/subcription/subscription.service';
import { SubscriptionRepository } from '@repository/subscription.repository';
import { PackageRepository } from '@repository/package.repository';
import { FollowRepository } from '@repository/follow.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository, SubscriptionRepository, PackageRepository, WalletRepository, FollowRepository]), AuthModule],
  providers: [CryptStrategy, UserService, CommonService, SubscriptionService],
  exports: [UserService],
})
export class UserModule { }
