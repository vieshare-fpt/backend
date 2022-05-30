/*
https://docs.nestjs.com/providers#services
*/

import { SubscriptionEntity } from '@data/entity/subscription.entity';
import { NewSubscriptionRequest } from '@data/request/new-subsciption.request';
import { UserNotExistedException } from '@exception/user/user-not-existed.exception';
import { Injectable } from '@nestjs/common';
import { SubscriptionRepository } from '@repository/subscription.repository';
import { UserRepository } from '@repository/user.repository';

@Injectable()
export class SubscriptionService {
    constructor(
        private subscriptionRepository: SubscriptionRepository,
        private userRepository: UserRepository,
    ) { }

    async createSubscription(
        userID: string,
        subscriptionRequest: NewSubscriptionRequest,
    ): Promise<any> {
        const isExistUser = await this.userRepository.findOne(userID);
        if (!isExistUser) throw new UserNotExistedException();


        const subscriptionEntity: SubscriptionEntity = new SubscriptionEntity();
        subscriptionEntity.userID = userID;
        subscriptionEntity.start_at = new Date();
        subscriptionEntity.end_at =
            await this.subscriptionRepository.getEndDate(subscriptionRequest.options);
        
            //ToDO
        return await this.subscriptionRepository.save(subscriptionEntity);
    }

}
