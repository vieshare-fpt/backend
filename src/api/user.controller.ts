import { HttpResponse } from '@common/http.response';
import { Public } from '@decorator/public.decorator';
import { Body, Controller, Get, Post, Patch, Query, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
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
import { InfoUserResponse } from '@data/response/info-user.response';
import { Roles } from '@decorator/role.decorator';
import { Role } from '@constant/role.enum';
import { ChangeRoleUserRequest } from '@data/request/change-role-user.request';
import { UpdateAvatarRequest } from '@data/request/update-avatar.request';
import { HttpPagingResponse } from '@common/http-paging.response';
import { PagingRequest } from '@data/request/paging.request';
import { Sort } from '@constant/sort.enum';
import { UserOrderBy } from '@constant/user-order-by.enum';
import { UpdateUserRequest } from '@data/request/update-user.request';

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
  @Roles(Role.Admin)
  @Get('')
  @HttpCode(HttpStatus.OK)
  @ApiQuery({ name: 'isDelete', type: 'boolean', example: false, required: false })
  @ApiQuery({ name: 'order_by', type: 'enum', enum: UserOrderBy, example: UserOrderBy.dob, required: false })
  @ApiQuery({ name: 'sort', type: 'enum', enum: Sort, example: Sort.DESC, required: false })
  @ApiQuery({ name: 'roles', type: 'enum', enum: Role, example: Role.User, required: false })
  @ApiQuery({ name: 'per_page', type: 'number', example: 10, required: false })
  @ApiQuery({ name: 'page', type: 'number', example: 1, required: false })
  async getAllUser(
    @Query('isDelete') isDelete: string,
    @Query('order_by') orderBy: UserOrderBy,
    @Query('sort') sort: Sort,
    @Query('roles') roles: Role,
    @Query() paging: PagingRequest
  ): Promise<HttpResponse<UserResponse[]> | HttpPagingResponse<UserResponse[]>> {

    const usersResponse = await this.userService.getListsUsers(orderBy, sort, roles, isDelete, paging.per_page, paging.page)

    return usersResponse;
  }


  @Public()
  @Get('/info/:id')
  @ApiParam({ name: 'id', type: 'string', required: true, example: 'ccff1be6-8db1-4d95-8022-41b62df5edb4' })
  async getInfoByUserId(
    @Param('id') userId: string
  ): Promise<InfoUserResponse> {
    const info = await this.userService.getInfoByUserId(userId)
    return info;
  }

  @ApiBearerAuth()
  @Get('info')
  async getInfo(
    @CurrentUser() user: User,
  ): Promise<HttpResponse<UserResponse>> {
    const userEntity = await this.userService.getUserByUserId(user.id);
    const isPremium = await this.subscriptionService.checkUserIsPremium(user.id);
    const userResponse = UserResponse.formatUserEntity(userEntity, isPremium);


    return HttpResponse.success(userResponse);
  }

  @ApiBearerAuth()
  @Patch('info')
  async updateInfo(
    @CurrentUser() user: User,
    @Body() newInfo: UpdateInfoRequest,
  ): Promise<HttpResponse<Boolean>> {
    const updateInfo = await this.userService.updateInfo(user.id, newInfo);
    return HttpResponse.success(updateInfo);
  }

  @Roles(Role.Admin)
  @ApiBearerAuth()
  @Patch('/:id')
  @ApiParam({ name: 'id', type: 'string', required: true, example: 'ccff1be6-8db1-4d95-8022-41b62df5edb4' })
  async updateUser(
    @Param('id') userId: string,
    @Body() updateUser: UpdateUserRequest,
  ): Promise<HttpResponse<Boolean>> {
    const updateInfo = await this.userService.updateUser(userId, updateUser);
    return HttpResponse.success(updateInfo);
  }

  @ApiBearerAuth()
  @Patch('avatar')
  async updateAvatar(
    @CurrentUser() user: User,
    @Body() newAvatar: UpdateAvatarRequest,
  ): Promise<HttpResponse<Boolean>> {
    const updateInfo = await this.userService.updateAvatar(user.id, newAvatar.avatar);
    return HttpResponse.success(updateInfo);
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

  @ApiBearerAuth()
  @Roles(Role.Admin)
  @Patch('change-role')
  async changeRole(
    @Body() changeRoleUserRequest: ChangeRoleUserRequest
  ) {
    await this.userService.changeRoleUserRequest(changeRoleUserRequest);
    return HttpResponse.success()

  }

}
