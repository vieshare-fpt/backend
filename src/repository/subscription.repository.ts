import { TimeFrame } from "@constant/time-frame.enum";
import { SubscriptionEntity } from "@data/entity/subscription.entity";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(SubscriptionEntity)
export class SubscriptionRepository extends Repository<SubscriptionEntity>{
  async isPremium(userId: string) {
    const subsciption = await this.createQueryBuilder('subscriptions')
      .leftJoin('packages', 'packages', 'subscriptions.packageId= packages.id')
      .select('subscriptions.id , subscriptions.userId , subscriptions.date , packages.expiresAfterNumberOfDays')
      .addSelect('DATE_ADD(subscriptions.date , INTERVAL packages.expiresAfterNumberOfDays DAY)', 'dateExpires')
      .where('DATE(NOW()) <= DATE_ADD(subscriptions.date , INTERVAL packages.expiresAfterNumberOfDays DAY)')
      .andWhere('subscriptions.userId = :userId', { userId: userId })
      .getRawOne();
    return subsciption ? true : false
  }

  async countPremiumUser() {
    const subsciption = await this.createQueryBuilder('subscriptions')
      .leftJoin('packages', 'packages', 'subscriptions.packageId= packages.id')
      .where('DATE(NOW()) <= DATE_ADD(subscriptions.date , INTERVAL packages.expiresAfterNumberOfDays DAY)')
      .groupBy('userId')
      .getCount();
    return subsciption;
  }

  async sumIncome() {
    const { sum } = await this.createQueryBuilder("subscriptions")
      .leftJoin('packages', 'packages', 'subscriptions.packageId= packages.id')
      .select("SUM(packages.price)", "sum")
      .getRawOne();
    return parseInt(sum);
  }

  async statisticPackages(from: string, to: string, timeFrame: TimeFrame) {
    let group = "";
    if (timeFrame == TimeFrame.OneDay) {
      group = "DATE_FORMAT(date, '%Y-%m-%d')";
    }
    if (timeFrame == TimeFrame.OneMonth) {
      group = "DATE_FORMAT(date, '%Y-%m')";
    }
    if (timeFrame == TimeFrame.OneYear) {
      group = "DATE_FORMAT(date, '%Y')";
    }
    const statisticCounts = await this.createQueryBuilder('subscriptions')
      .where('subscriptions.date >= :from', { from })
      .andWhere('subscriptions.date <= :to', { to })
      .leftJoinAndSelect('subscriptions.package', 'package')
      .select(group, 'date')
      .addSelect('package.name', 'name')
      .addSelect('COUNT(*)', 'value')
      .groupBy(group)
      .addGroupBy('package.name')
      .getRawMany();

    return statisticCounts;
  }
  async statisticIncomes(from: string, to: string, timeFrame: TimeFrame) {
    let group = "";
    if (timeFrame == TimeFrame.OneDay) {
      group = "DATE_FORMAT(date, '%Y-%m-%d')";
    }
    if (timeFrame == TimeFrame.OneMonth) {
      group = "DATE_FORMAT(date, '%Y-%m')";
    }
    if (timeFrame == TimeFrame.OneYear) {
      group = "DATE_FORMAT(date, '%Y')";
    }
    const statisticCounts = await this.createQueryBuilder('subscriptions')
      .where('subscriptions.date >= :from', { from })
      .andWhere('subscriptions.date <= :to', { to })
      .leftJoinAndSelect('subscriptions.package', 'package')
      .select(group, 'date')
      .addSelect('package.name', 'name')
      .addSelect('SUM(package.price)', 'value')
      .groupBy(group)
      .addGroupBy('package.name')
      .getRawMany();

    return statisticCounts;
  }
}
