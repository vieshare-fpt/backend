import { BonusStatisticOrderBy } from "@constant/bonus-statistic-order-by.enum";
import { BonusStatisticStatus } from "@constant/bonus-statistic-status.enum";
import { Sort } from "@constant/sort.enum";
import { TimeFrame } from "@constant/time-frame.enum";
import { BonusFormulaEntity } from "@data/entity/bonus-formula.entity";
import { BonusStatisticEntity } from "@data/entity/bonus-statistic.entity";
import { EntityRepository, In, LessThan, Repository } from "typeorm";

@EntityRepository(BonusStatisticEntity)
export class BonusStatisticReposiotry extends Repository<BonusStatisticEntity> {
  async autoUpdateStatus() {
    return await this.createQueryBuilder("bounusStatistics")
      .where("status = :status", { status: BonusStatisticStatus.Processing })
      .andWhere("to <= :date", { date: new Date() })
      .update<BonusStatisticEntity>(BonusStatisticEntity, { status: BonusStatisticStatus.Ready })
      .updateEntity(true)
      .execute();

  }
  async getBonusStatisticByUserId(userId: string, skip?: number, take?: number): Promise<BonusStatisticEntity[]> {
    const bonusResponse = await this.createQueryBuilder('bounus-statistics')
      .select('bounus-statistics.id', 'id')
      .addSelect('bounus-statistics.postId', 'postId')
      .addSelect('bounus-statistics.views', 'views')
      .addSelect('bounus-statistics.from', 'from')
      .addSelect('bounus-statistics.to', 'to')
      .addSelect('bounus-statistics.bonusFormulaId', 'bonusFormulaId')
      .addSelect('bounus-statistics.status', 'status')
      .leftJoin('bounus-statistics.post', 'posts')
      .where('posts.authorId = :authorId', { authorId: userId })
      .skip(skip || 0)
      .take(take || null)
      .getRawMany()
    return bonusResponse;
  }

  async countBonusStatisticByUserId(userId: string): Promise<number> {
    const bonusResponse = await this.createQueryBuilder('bounus-statistics')
      .select('bounus-statistics')
      .leftJoinAndSelect('bounus-statistics.post', 'posts')
      .where('posts.authorId = :authorId', { authorId: userId })
      .getCount();
    return bonusResponse;
  }

  async sumBonusByUserId(userId: string) {
    const { sum } = await this.createQueryBuilder("bonusStatistics")
      .leftJoinAndSelect('bonusStatistics.post', 'posts')
      .leftJoinAndSelect('bonusStatistics.bonusFormula', 'bonusFormulas')
      .andWhere('posts.author = :userId', { userId })
      .select("SUM(bonusFormulas.bonusPerView * posts.views)", "sum")
      .getRawOne();
    return parseInt(sum ? sum : 0);
  }

  async getBonusStatisticByUserIdOrderBy(userId: string, orderBy: BonusStatisticOrderBy, sort: Sort, skip?: number, take?: number): Promise<BonusStatisticEntity[]> {
    const bonusResponse = await this.createQueryBuilder('bounus-statistics')
      .select('bounus-statistics.id', 'id')
      .addSelect('bounus-statistics.postId', 'postId')
      .addSelect('bounus-statistics.views', 'views')
      .addSelect('bounus-statistics.from', 'from')
      .addSelect('bounus-statistics.to', 'to')
      .addSelect('bounus-statistics.bonusFormulaId', 'bonusFormulaId')
      .addSelect('bounus-statistics.status', 'status')
      .addSelect('posts.title','postTitle')
      .addSelect('posts.id','postId')
      .addSelect('bonusFormulas.bonusPerView','bonusPerView')
      .leftJoin('bounus-statistics.post', 'posts')
      .leftJoin('bounus-statistics.bonusFormula','bonusFormulas')
      .where('posts.authorId = :authorId', { authorId: userId })
      .skip(skip || 0)
      .take(take || null)
      .orderBy(`bounus-statistics.${orderBy}`, sort)
      .getRawMany()
    return bonusResponse;
  }

  async statisticBounsByWriterId(authorId: string, from: string, to: string, timeFrame: TimeFrame) {
    let group = "";
    if (timeFrame == TimeFrame.OneDay) {
      group = "DATE_FORMAT(bonusStatistics.from, '%Y-%m-%d')";
    }
    if (timeFrame == TimeFrame.OneMonth) {
      group = "DATE_FORMAT(bonusStatistics.from, '%Y-%m')";
    }
    if (timeFrame == TimeFrame.OneYear) {
      group = "DATE_FORMAT(bonusStatistics.from, '%Y')";
    }
    const statisticComments = await this.createQueryBuilder('bonusStatistics')
      .where('bonusStatistics.from >= :from', { from })
      .andWhere('bonusStatistics.from <= :to', { to })
      .leftJoinAndSelect('bonusStatistics.post', 'posts')
      .leftJoinAndSelect('bonusStatistics.bonusFormula', 'bonusFormulas')
      .andWhere('posts.author = :authorId', { authorId })
      .select(group, 'date')
      .addSelect('posts.type', 'name')
      .addSelect("SUM(bonusFormulas.bonusPerView * posts.views)", "value")
      .groupBy(group)
      .addGroupBy('posts.type')
      .getRawMany();

    return statisticComments;
  }
}
