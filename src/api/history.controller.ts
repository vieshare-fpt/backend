import { HttpResponse } from "@common/http.response";
import { User } from "@common/user";
import { HistoryEntity } from "@data/entity/history.entity";
import { PostIdRequest } from "@data/request/postId.request";
import { CurrentUser } from "@decorator/current-user.decorator";
import { PublicPrivate } from "@decorator/public-private.decorator";
import { Body, Controller, Get, Headers, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiHeader, ApiTags } from "@nestjs/swagger";
import { HistoryService } from "@service/history/history.service";

@ApiTags('History')
@Controller('api/history')
export class HistoryController {
  constructor(
    private historyService: HistoryService
  ) { }


  @ApiBearerAuth()
  @Get('')
  @HttpCode(HttpStatus.OK)
  async getHistory(
    @CurrentUser() user: User,
  ): Promise<HttpResponse<HistoryEntity[]> | any> {

    const history = await this.historyService.getHistoryForUser(user.id)
    return HttpResponse.success(history)

  }


}
