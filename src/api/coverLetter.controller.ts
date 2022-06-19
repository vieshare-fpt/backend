import { HttpResponse } from "@common/http.response";
import { User } from "@common/user";
import { Role } from "@constant/role.enum";
import { NewCoverLetterRequest } from "@data/request/new-cover-letter.request";
import { CurrentUser } from "@decorator/current-user.decorator";
import { Roles } from "@decorator/role.decorator";
import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CoverLetterService } from "@service/coverLetter/coverLetter.service";

@ApiTags('Cover Letter')
@Controller('api/cover-letter')
export class CoverLetterController {
  constructor(
    private coverLetterService: CoverLetterService,
  ) { }

  @ApiBearerAuth()
  @Post('')
  async createCoverLetter(
    @CurrentUser() user: User,
    @Body() newCoverLetterRequest: NewCoverLetterRequest
  ) {
    const createCoverLetterResponse = await this.coverLetterService.createCoverLetter(newCoverLetterRequest, user.id);
    return HttpResponse.success(createCoverLetterResponse)
  }

  @ApiBearerAuth()
  @Roles(Role.Admin)
  @Get('/all')
  async getAllCoverLetter() {
    const getAllCoverLetterResponse = await this.coverLetterService.getAllCoverLetter();
    return HttpResponse.success(getAllCoverLetterResponse)
  }

  @ApiBearerAuth()
  @Get('')
  async getUserCoverLetter(
    @CurrentUser() user: User
  ) {
    const getCoverLetterResponse = await this.coverLetterService.getCoverLetterByUserId(user.id);
    return HttpResponse.success(getCoverLetterResponse)
  }


}
