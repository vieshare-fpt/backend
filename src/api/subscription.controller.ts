import { User } from "@common/user";
import { Sort } from "@constant/sort.enum";
import { NewPackageRequest } from "@data/request/new-package.request";
import { NewSubscriptionRequest } from "@data/request/new-subsciption.request";
import { PagingRequest } from "@data/request/paging.request";
import { CurrentUser } from "@decorator/current-user.decorator";
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { SubscriptionService } from "@service/subcription/subscription.service";

@ApiTags('Subcription')
@Controller('api/subscriptions')
export class SubscriptionController {
  constructor(
    private subscriptionService: SubscriptionService
  ) { }

  @Get('')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiQuery({ name: 'sort', type: 'enum', enum: Sort, example: Sort.DESC, required: false })
  @ApiQuery({ name: 'packageId', type: 'string', example: 'f30bc2d9-0aa1-4367-b977-a93fb8a9f333', required: false })
  @ApiQuery({ name: 'per_page', type: 'number', example: 10, required: false })
  @ApiQuery({ name: 'page', type: 'number', example: 1, required: false })
  async getSubsciption(
    @CurrentUser() user: User,
    @Query('sort') sort: Sort,
    @Query('packageId') packageId: string,
    @Query() paging: PagingRequest,
  ) {
    const subcription = await this.subscriptionService
      .getSubscriptions(user.id, packageId,  sort, paging);
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
