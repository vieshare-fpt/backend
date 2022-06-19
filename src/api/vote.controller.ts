import { User } from "@common/user";
import { VoteRequest } from "@data/request/vote.request";
import { CurrentUser } from "@decorator/current-user.decorator";
import { Public } from "@decorator/public.decorator";
import { OutOfRangeVoteException } from "@exception/vote/out-of-range-vote.exception";
import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { VoteService } from "@service/vote/vote.service";

@ApiTags('Vote')
@Controller('/api/votes')
export class VoteController {
  constructor(
    private voteService: VoteService
  ) { }

  @Public()
  @Get('/post/:id')
  @HttpCode(HttpStatus.OK)
  async getVoteByPostId(
    @Param('id') postId: string
  ) {
    return await this.voteService.getVoteByPostId(postId);
  }

  @ApiBearerAuth()
  @Post()
  @HttpCode(HttpStatus.OK)
  async votePost(
    @CurrentUser() user: User,
    @Body() voteRequest: VoteRequest
  ) {
    if (voteRequest.point > 5 || voteRequest.point < 0) {
      throw new OutOfRangeVoteException()
    }
    const saveVote = await this.voteService.saveVote(user.id, voteRequest);
  }
}
