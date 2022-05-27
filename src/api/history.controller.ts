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
  @PublicPrivate()
  @Post('')
  @HttpCode(HttpStatus.OK)
  @ApiHeader({ name: 'User-Agent', required: false })
  async addHistory(
    @CurrentUser() user: User,
    @Headers('User-Agent') agent: string,
    @Body() postIdRequest: PostIdRequest
  ): Promise<HttpResponse<HistoryEntity>> {

    if (!user) {
      const history = await this.historyService.saveHistoryForAnonymous(postIdRequest.postId, agent)
      return HttpResponse.success(history)
    }
    const history = await this.historyService.saveHistoryForUsers(postIdRequest.postId, user.id);
    return HttpResponse.success(history)
  }


  @ApiBearerAuth()
  @PublicPrivate()
  @Get('')
  @HttpCode(HttpStatus.OK)
  @ApiHeader({ name: 'User-Agent', required: false })
  async getHistory(
    @CurrentUser() user: User,
    @Headers('User-Agent') agent: string,
  ): Promise<HttpResponse<HistoryEntity[]> | any> {

    if (!user) {
      const history = await this.historyService.getHistoryForAnonymus(agent)
      return HttpResponse.success(history)
    }
    const history = await this.historyService.getHistoryForUser(user.id)
    return HttpResponse.success(history)

  }


}
