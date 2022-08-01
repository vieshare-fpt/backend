import { Sort } from "@constant/sort.enum";
import { TimeFrame } from "@constant/time-frame.enum";
import { SubscriptionEntity } from "@data/entity/subscription.entity";
import { EntityRepository, FindConditions, Repository } from "typeorm";

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

  private changeNamePropertyObject(object: any, oldName: string, newName: string) {
    object[newName] = object[oldName];
    delete object[oldName];
    return object;
  }

  private formatSubscriptionsResponse(object: any) {
    const subscriptionsResponse =
      object.map(({ id, userId, packageId, ...subscriptionsResponse }) => {
        this.changeNamePropertyObject(subscriptionsResponse, '__package__', 'package');
        this.changeNamePropertyObject(subscriptionsResponse, '__user__', 'user');
        delete subscriptionsResponse['user']['password'];
        delete subscriptionsResponse['user']['dob'];
        delete subscriptionsResponse['user']['isDefaultPassword'];
        delete subscriptionsResponse['user']['avatar'];
        delete subscriptionsResponse['package']['createDate'];
        delete subscriptionsResponse['package']['isActive'];
        return subscriptionsResponse;
      })
    return subscriptionsResponse;
  }
  async findSubsciptions(
    where: FindConditions<SubscriptionEntity>,
    sort?: Sort, skip?: number, take?: number
  ): Promise<SubscriptionEntity[] | any> {
    const subscriptions = await this.find(
      {
        where: where,
        relations: ['package', 'user'],
        order: {
          date: 'DESC'
        },
        skip: skip || 0,
        take: take || null
      }
    );
    return this.formatSubscriptionsResponse(subscriptions);
  }


  async countSubscriptions(userId: string): Promise<number> {
    const count = await this.count(
      {
        where: {
          userId: userId
        }
      });
    return count;
  }

}
