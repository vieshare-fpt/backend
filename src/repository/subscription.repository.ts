import { SubscriptionEntity } from "@data/entity/subscription.entity";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(SubscriptionEntity)
export class SubscriptionRepository extends Repository<SubscriptionEntity>{
  async isPremium(userId: string) {
    const subsciption = await this.createQueryBuilder('subsciption')
      .leftJoin('packages', 'packages', 'subsciption.packageId= packages.id')
      .select('subsciption.id , subsciption.userId , subsciption.date , packages.expiresAfterNumberOfDays')
      .addSelect('DATE_ADD(subsciption.date , INTERVAL packages.expiresAfterNumberOfDays DAY)', 'dateExpires')
      .where('DATE(NOW()) <= DATE_ADD(subsciption.date , INTERVAL packages.expiresAfterNumberOfDays DAY)')
      .andWhere('subsciption.userId = :userId', { userId: userId })
      .getRawOne();


    return subsciption ? true : false
  }

}
