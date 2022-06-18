import { User } from "@common/user";
import { NewPackageRequest } from "@data/request/new-package.request";
import { NewSubscriptionRequest } from "@data/request/new-subsciption.request";
import { CurrentUser } from "@decorator/current-user.decorator";
import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { SubscriptionService } from "@service/subcription/subscription.service";

@ApiTags('Subcription')
@Controller('api/subscriptions')
export class SubscriptionController {
  constructor(
    private subscriptionService: SubscriptionService
  ) { }

  @Get('')
  @ApiBearerAuth()
  async getSubsciption(
    @CurrentUser() user: User
  ){
    const subcription = await this.subscriptionService.getSubscriptionByUserId(user.id);
    return subcription
  }


  @Post('')
  @ApiBearerAuth()
  async createSubscription(
    @CurrentUser() user: User,
    @Body() newSubscription: NewSubscriptionRequest
  ) {
    const subscription = await this.subscriptionService.newSubscription(user, newSubscription.packageId);
    return subscription
  }

}
