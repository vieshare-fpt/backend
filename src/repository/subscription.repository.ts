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

  async sumIncome() {
    const { sum } = await this.createQueryBuilder("subscriptions")
      .leftJoin('packages', 'packages', 'subscriptions.packageId= packages.id')
      .select("SUM(packages.price)", "sum")
      .getRawOne();
    return parseInt(sum);
  }

}
