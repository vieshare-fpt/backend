import { HttpPagingResponse } from "@common/http-paging.response";
import { User } from "@common/user";
import { Role } from "@constant/role.enum";
import { Sort } from "@constant/sort.enum";
import { SubscriptionEntity } from "@data/entity/subscription.entity";
import { PagingRequest } from "@data/request/paging.request";
import { PagingRepsone } from "@data/response/paging.response";
import { PackageNotExistedException } from "@exception/package/package-not-existed.exception";
import { UserAlreadyPremiumException } from "@exception/subscription/user-already-premium.exception";
import { UserNotAuthorizedException } from "@exception/user/user-not-authorizated.exception";
import { UserNotExistedException } from "@exception/user/user-not-existed.exception";
import { BalanceNotEnoughException } from "@exception/wallet/balance-not-enough.exception";
import { WalletNotExistedException } from "@exception/wallet/wallet-not-existed.exception";
import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { PackageRepository } from "@repository/package.repository";
import { SubscriptionRepository } from "@repository/subscription.repository";
import { UserRepository } from "@repository/user.repository";
import { WalletRepository } from "@repository/wallet.repository";
import { CommonService } from "@service/common/common.service";


@Injectable()
export class SubscriptionService {
  constructor(
    private subscriptionRepository: SubscriptionRepository,
    private userRepository: UserRepository,
    private packageRepository: PackageRepository,
    private walletRepository: WalletRepository,
    private commonService: CommonService<SubscriptionEntity | any>,
  ) { }

  async getSubscriptions(
    userId: string,
    packageId?: string,
    sort?: Sort,
    paging?: PagingRequest
  ) {
    const userExsited = await this.userRepository.findOne({ id: userId });
    if (!userExsited) {
      throw new UserNotExistedException()
    }

    const where = await this.commonService.removeUndefined({
      userId,
      packageId
    })
    let page = paging.page | 1;
    let perPage = paging.per_page;
    let total = 0;
    let totalPages = 0;
    sort = sort && Sort[sort.toLocaleUpperCase()] ? Sort[sort] : Sort.ASC;
    const subscriptions = await this.subscriptionRepository.
      findSubsciptions(where, sort, perPage * (page - 1), perPage);

    total = await this.subscriptionRepository.countSubscriptions(userId);
    totalPages = Math.ceil(total / totalPages);
    const metaData = new PagingRepsone(page, perPage, total, totalPages);
    if(!subscriptions){
     throw new HttpException(NotFoundException, HttpStatus.NO_CONTENT);  
    }
    if(!perPage){
      return HttpPagingResponse.success(subscriptions);
    }

    return HttpPagingResponse.success(subscriptions, metaData);
  }

  async newSubscription(user: User, packageId: string) {
    const userExsited = await this.userRepository.findOne({ id: user.id });
    if (!userExsited) {
      throw new UserNotExistedException()
    }

    if (!userExsited.roles.includes(Role.User) && userExsited.roles.length == 1) {
      throw new UserNotAuthorizedException()
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
