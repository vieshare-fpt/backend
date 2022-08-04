import { BonusStatisticOrderBy } from "@constant/bonus-statistic-order-by.enum";
import { BonusStatisticStatus } from "@constant/bonus-statistic-status.enum";
import { Sort } from "@constant/sort.enum";
import { TypePost } from "@constant/types-post.enum";
import { BonusStatisticEntity } from "@data/entity/bonus-statistic.entity";
import { BonusHasWithdrawnBeforeException } from "@exception/bonusStatistic/bonus-has-withdrawn-before.exception";
import { BonusNotExistedException } from "@exception/bonusStatistic/bonus-statistic-not-existed.exception";
import { NowCanNotWithdrawBonusException } from "@exception/bonusStatistic/now-can-not-withdraw-bonus.exception";
import { PostNotExistedException } from "@exception/post/post-not-existed.exception";
import { PostNotPremiumException } from "@exception/post/post-not-premium.exception";
import { UserNotExistedException } from "@exception/user/user-not-existed.exception";
import { WalletNotExistedException } from "@exception/wallet/wallet-not-existed.exception";
import { BadRequestException, Injectable } from "@nestjs/common";
import { BonusFormulaReposiotry } from "@repository/bonusFormula.repository";
import { BonusStatisticReposiotry } from "@repository/bonusStatistic.repository";
import { PostRepository } from "@repository/post.repository";
import { UserRepository } from "@repository/user.repository";
import { WalletRepository } from "@repository/wallet.repository";
import { BonusFormulaService } from "@service/bonusFormula/bonusFormula.service";
import { CommonService } from "@service/common/common.service";


@Injectable()
export class BonusStatisticService {
  constructor(
    private bonusStatisticRepository: BonusStatisticReposiotry,
    private bonusFormulaReposiotry: BonusFormulaReposiotry,
    private bonusFormulaSerivce: BonusFormulaService,
    private postRepository: PostRepository,
    private userRepository: UserRepository,
    private commonService: CommonService<BonusStatisticEntity>,
    private walletRepository: WalletRepository
  ) { }

  async makeBonusStatistic(postId: string): Promise<BonusStatisticEntity> {
    const existedPost = await this.postRepository.findOne(postId);
    if (!existedPost) {
      throw new PostNotExistedException();
    }
    if (existedPost.type !== TypePost.Premium) {
      throw new PostNotPremiumException();
    }
    const formula = await this.bonusFormulaSerivce.getActiveFormulaIsActive();

    const nowDate = new Date();
    const nowMonth = nowDate.getMonth();
    const nowYear = nowDate.getFullYear();
    const fromDate = new Date(nowYear, nowMonth, 1);
    const toDate = new Date(nowYear, nowMonth + 1, 0);


    const newBonusStatisticEntity = new BonusStatisticEntity();
    newBonusStatisticEntity.postId = postId;
    newBonusStatisticEntity.from = fromDate;
    newBonusStatisticEntity.to = toDate;
    newBonusStatisticEntity.bonusFormulaId = formula.id;
    newBonusStatisticEntity.views = 1;

    const bonusStatisticEntityExited = await this.bonusStatisticRepository.findOne({
      where: {
        postId: postId,
        to: toDate
      }
    })
    if (bonusStatisticEntityExited) {
      return await this.updateViewByBonusStatisticId(bonusStatisticEntityExited.id)
    }

    return await this.bonusStatisticRepository.save(newBonusStatisticEntity)


  }


  private async updateViewByBonusStatisticId(id: string): Promise<BonusStatisticEntity> {
    const bonusStatisticEntityExited = await this.bonusStatisticRepository.findOne(id)
    if (!bonusStatisticEntityExited) {
      throw new BadRequestException()
    }

    return (await this.bonusStatisticRepository.update(
      {
        id: bonusStatisticEntityExited.id
      },
      {
        views: bonusStatisticEntityExited.views + 1
      }
    )).raw[0]
  }


  private async getBonusStatisticByUserId(id: string, perPage: number, page: number) {
    page = page ? page : 1;
    const bonusStatisticResponse = await this.bonusStatisticRepository.getBonusStatisticByUserId(id, perPage * (page - 1), perPage)
    const total = await this.bonusStatisticRepository.countBonusStatisticByUserId(id);

    return this.commonService.getPagingResponse(bonusStatisticResponse, perPage, page, total)

  }

  async getBonusStatisticByUserIdOrderBy(id: string, orderBy: BonusStatisticOrderBy, sort: Sort, perPage: number, page: number) {
    const userExisted = await this.userRepository.findOne(id);
    if (!userExisted) {
      throw new UserNotExistedException()
    }
    sort = sort && Sort[sort.toLocaleUpperCase()] ? Sort[sort] : Sort.ASC;
    page = page ? page : 1;

    if (!orderBy) {
      return this.getBonusStatisticByUserId(userExisted.id, perPage, page);
    }

    orderBy = BonusStatisticOrderBy[orderBy];
    if (!orderBy) {
      throw new BadRequestException()
    }
    await this.bonusStatisticRepository.autoUpdateStatus()
    const bonusStatisticResponse = (await this.bonusStatisticRepository.getBonusStatisticByUserIdOrderBy(id, orderBy, sort, perPage * (page - 1), perPage)).map((item:any) => {
      return {
        ...item,
        price: item.views * item.bonusPerView
      }
    });
    const total = await this.bonusStatisticRepository.countBonusStatisticByUserId(id)
    return this.commonService.getPagingResponse(bonusStatisticResponse, perPage, page, total)
  }

  async withdrawBonusBonusStatisticByUserId(userId: string, bonusStatisitcId: string) {
    const userExisted = await this.userRepository.findOne({ id: userId });
    if (!userExisted) {
      throw new UserNotExistedException()
    }

    await this.bonusStatisticRepository.autoUpdateStatus()

    const bonusStatisitcExisted = await this.bonusStatisticRepository.findOne({ id: bonusStatisitcId });
    if (!bonusStatisitcExisted) {
      throw new BonusNotExistedException()
    }


    if (bonusStatisitcExisted.status == BonusStatisticStatus.Complete) {
      throw new BonusHasWithdrawnBeforeException()
    }

    if (bonusStatisitcExisted.to.getTime() > new Date().getTime() || bonusStatisitcExisted.status == BonusStatisticStatus.Processing) {
      throw new NowCanNotWithdrawBonusException()
    }

    const withdrawn = await this.bonusStatisticRepository.update({ id: bonusStatisitcExisted.id }, { status: BonusStatisticStatus.Complete });
    const walletExsited = await this.walletRepository.findOne({ userId: userExisted.id });
    const formula = await this.bonusFormulaReposiotry.findOne({ id: bonusStatisitcExisted.bonusFormulaId })
    const bonus = bonusStatisitcExisted.views * formula.bonusPerView;
    if (!walletExsited) {
      throw new WalletNotExistedException()
    }

    if (withdrawn.affected <= 0) {
      return false;
    }
    const updateBalance = await this.walletRepository.update({ id: walletExsited.id }, { balance: walletExsited.balance + bonus });

    return updateBalance.affected ? true : false;

  }

}
