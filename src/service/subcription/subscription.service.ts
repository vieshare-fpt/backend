import { User } from "@common/user";
import { SubscriptionEntity } from "@data/entity/subscription.entity";
import { PackageNotExistedException } from "@exception/package/package-not-existed.exception";
import { UserAlreadyPremiumException } from "@exception/subscription/user-already-premium.exception";
import { UserNotExistedException } from "@exception/user/user-not-existed.exception";
import { BalanceNotEnoughException } from "@exception/wallet/balance-not-enough.exception";
import { WalletNotExistedException } from "@exception/wallet/wallet-not-existed.exception";
import { BadRequestException, Injectable } from "@nestjs/common";
import { PackageRepository } from "@repository/package.repository";
import { SubscriptionRepository } from "@repository/subscription.repository";
import { UserRepository } from "@repository/user.repository";
import { WalletRepository } from "@repository/wallet.repository";
import { WalletService } from "@service/wallet/wallet.service";

@Injectable()
export class SubscriptionService {
  constructor(
    private subscriptionRepository: SubscriptionRepository,
    private userRepository: UserRepository,
    private packageRepository: PackageRepository,
    private walletRepository: WalletRepository,
  ) { }

  async getSubscriptionByUserId(userId: string) {
    const userExsited = await this.userRepository.findOne({ id: userId });
    if (!userExsited) {
      throw new UserNotExistedException()
    }

    const subscriptions = await this.subscriptionRepository.find({ userId: userId })
    return subscriptions
  }

  async newSubscription(user: User, packageId: string) {
    const userExsited = await this.userRepository.findOne({ id: user.id });
    if (!userExsited) {
      throw new UserNotExistedException()
    }

    const packageExisted = await this.packageRepository.findOne({ id: packageId });
    if (!packageExisted || !packageExisted.isActive) {
      throw new PackageNotExistedException();
    }

    const isPremium = await this.subscriptionRepository.isPremium(userExsited.id);
    if (isPremium) {
      throw new UserAlreadyPremiumException();
    }


    const walletExisted = await this.walletRepository.findOne({ userId: userExsited.id });
    if (!walletExisted) {
      throw new WalletNotExistedException()
    }

    const newBalance = walletExisted.balance - packageExisted.price;

    if (newBalance < 0) {
      throw new BalanceNotEnoughException()
    }

    const updateBalance = await this.walletRepository.update({ id: walletExisted.id }, { balance: newBalance });

    if (updateBalance.affected == 0) {
      throw new BadRequestException()
    }
    const newSubscription = new SubscriptionEntity()
    newSubscription.userId = userExsited.id;
    newSubscription.packageId = packageExisted.id;
    newSubscription.date = new Date();

    const saveSubscription = await this.subscriptionRepository.save(newSubscription)

    return saveSubscription
  }

  async checkUserIsPremium(userId: string): Promise<boolean> {
    const isPremium = await this.subscriptionRepository.isPremium(userId);
    return isPremium;

  }
}
