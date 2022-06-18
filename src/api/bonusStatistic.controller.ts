import { User } from "@common/user";
import { BonusStatisticOrderBy } from "@constant/bonus-statistic-order-by.enum";
import { Role } from "@constant/role.enum";
import { Sort } from "@constant/sort.enum";
import { PagingRequest } from "@data/request/paging.request";
import { CurrentUser } from "@decorator/current-user.decorator";
import { Roles } from "@decorator/role.decorator";
import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { BonusStatisticService } from "@service/bonusStatistic/bonusStatistic.service";

@ApiTags('Bonus Statistic')
@Controller('api/bonus-statistics')
export class BonusStatisticController {
  constructor(
    private bonusStatisticService: BonusStatisticService
  ) { }

  @ApiBearerAuth()
  @Roles(Role.Writer)
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiQuery({ name: 'order_by', type: 'enum', enum: BonusStatisticOrderBy, example: BonusStatisticOrderBy.from, required: false })
  @ApiQuery({ name: 'sort', type: 'enum', enum: Sort, example: Sort.DESC, required: false })
  @ApiQuery({ name: 'per_page', type: 'number', example: 10, required: false })
  @ApiQuery({ name: 'page', type: 'number', example: 1, required: false })
  @HttpCode(HttpStatus.CREATED)
  async getBonusStatisticByUserId(
    @CurrentUser() user: User,
    @Query('order_by') orderBy: BonusStatisticOrderBy,
    @Query('sort') sort: Sort,
    @Query() paging: PagingRequest
  ) {
    return await this.bonusStatisticService.getBonusStatisticByUserIdOrderBy(user.id, orderBy, sort, paging.per_page, paging.page)
  }


  @ApiBearerAuth()
  @Roles(Role.Writer)
  @Post('withdraw/:id')
  @HttpCode(HttpStatus.OK)
  async withdrawBonusBonusStatisticByUserId(
    @CurrentUser() user: User,
    @Param('id') bonusStatisitcId: string
  ) {
    return await this.bonusStatisticService.withdrawBonusBonusStatisticByUserId(user.id, bonusStatisitcId)
  }


}
