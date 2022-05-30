import { SubscriptionEntity } from "@data/entity/subscription.entity";
import { Repository } from "typeorm";


export class SubscriptionRepository extends Repository<SubscriptionEntity>{
    async getEndDate(
        option: number,
    ): Promise<Date> {
        const date = new Date();
        date.setDate(date.getDate() + option);
        return date;
    }
}