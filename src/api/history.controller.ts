import { HttpResponse } from "@common/http.response";
import { User } from "@common/user";
import { HistoryEntity } from "@data/entity/history.entity";
import { PagingRequest } from "@data/request/paging.request";
import { PostIdRequest } from "@data/request/postId.request";
import { CurrentUser } from "@decorator/current-user.decorator";
import { PublicPrivate } from "@decorator/public-private.decorator";
import { Body, Controller, Get, Headers, HttpCode, HttpStatus, Post, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiHeader, ApiQuery, ApiTags } from "@nestjs/swagger";
import { HistoryService } from "@service/history/history.service";

@ApiTags('History')
@Controller('api/history')
export class HistoryController {
  constructor(
    private historyService: HistoryService
  ) { }


  @ApiBearerAuth()
  @ApiQuery({ name: 'per_page', type: 'number', example: 10, required: false })
  @ApiQuery({ name: 'page', type: 'number', example: 1, required: false })
  @Get('')
  @HttpCode(HttpStatus.OK)
  async getHistory(
    @CurrentUser() user: User,
    @Query() paging: PagingRequest
  ): Promise<HttpResponse<HistoryEntity[]> | any> {

    const history = await this.historyService.getHistoryForUser(user.id, paging.per_page, paging.page)
    return HttpResponse.success(history)

  }


}
