import { BonusStatisticOrderBy } from "@constant/bonus-statistic-order-by.enum";
import { Sort } from "@constant/sort.enum";
import { BonusFormulaEntity } from "@data/entity/bonus-formula.entity";
import { BonusStatisticEntity } from "@data/entity/bonus-statistic.entity";
import { EntityRepository, In, Repository } from "typeorm";

@EntityRepository(BonusStatisticEntity)
export class BonusStatisticReposiotry extends Repository<BonusStatisticEntity> {
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
      .leftJoin('bounus-statistics.post', 'posts')
      .where('posts.authorId = :authorId', { authorId: userId })
      .skip(skip || 0)
      .take(take || null)
      .orderBy(`bounus-statistics.${orderBy}`, sort)
      .getRawMany()
    return bonusResponse;
  }
}
