import { HttpResponse } from '@common/http.response';
import { Public } from '@decorator/public.decorator';
import { Body, Controller, Get, Post, Patch, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RegisterRequest } from '@data/request/register.request';
import { RegisterResponse } from '@data/response/register.response';
import { UserService } from '@service/user/user.service';
import { CurrentUser } from '@decorator/current-user.decorator';
import { User } from '@common/user';
import { UserResponse } from '@data/response/user.response';
import { UpdateInfoRequest } from '@data/request/update-info.request';
import { UpdatePassRequest } from '@data/request/update-pass.request';
import { WalletService } from '@service/wallet/wallet.service';
import { SubscriptionService } from '@service/subcription/subscription.service';

@ApiTags('User')
@Controller('api/users')
export class UserController {
  constructor(
    private userService: UserService,
    private walletService: WalletService,
    private subscriptionService: SubscriptionService
  ) { }

  @Public()
  @Post('register')
  async registerUser(
    @Body() request: RegisterRequest,
  ): Promise<HttpResponse<RegisterResponse>> {
    const userEntity = await this.userService.createUser(request, false);
    if (userEntity) {
      await this.walletService.createWallet(userEntity.id)
    }
    return HttpResponse.success(new RegisterResponse(userEntity.id));
  }

  @ApiBearerAuth()
  @Get('info')
  async getInfo(
    @CurrentUser() user: User,
  ): Promise<HttpResponse<UserResponse>> {
    const userEntity = await this.userService.getUserByUserId(user.id);
    const isPremium = await this.subscriptionService.checkUserIsPremium(user.id);
    const userResponse = UserResponse.fromUserEntity(userEntity, isPremium);


    return HttpResponse.success(userResponse);
  }

  @ApiBearerAuth()
  @Patch('info')
  async updateInfo(
    @CurrentUser() user: User,
    @Body() newInfo: UpdateInfoRequest,
  ): Promise<HttpResponse<UserResponse>> {
    const userEntity = await this.userService.updateInfo(user.id, newInfo);
    const isPremium = await this.subscriptionService.checkUserIsPremium(user.id);
    const userResponse = UserResponse.fromUserEntity(userEntity, isPremium);

    return HttpResponse.success(userResponse);
  }

  @ApiBearerAuth()
  @Patch('password')
  async updatePassword(
    @CurrentUser() user: User,
    @Body() body: UpdatePassRequest,
  ): Promise<HttpResponse<void>> {
    await this.userService.updatePassword(user.id, body);

    return HttpResponse.success();
  }


}
