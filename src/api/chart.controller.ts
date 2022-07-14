import { HttpResponse } from "@common/http.response";
import { User } from "@common/user";
import { ChartName } from "@constant/chart-name.enum";
import { Role } from "@constant/role.enum";
import { TimeFrame } from "@constant/time-frame.enum";
import { CurrentUser } from "@decorator/current-user.decorator";
import { Public } from "@decorator/public.decorator";
import { BadRequestException, Controller, Get, HttpCode, HttpStatus, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { ChartService } from "@service/chart/chart.service";


@ApiTags('Chart')
@Controller('/api/charts')
export class ChartController {
  constructor(
    private chartService: ChartService
  ) { }


  @ApiBearerAuth()
  @Get('total')
  @HttpCode(HttpStatus.OK)
  async getTotal(
    @CurrentUser() user: User,
  ): Promise<HttpResponse<any>> {

    if (user.roles.includes(Role.Admin)) {
      const totalResponse = await this.chartService.getAdminTotal();
      return HttpResponse.success(totalResponse);
    }
    if (user.roles.includes(Role.Writer)) {
      const totalResponse = await this.chartService.getWriterTotal(user.id);
      return HttpResponse.success(totalResponse);
    }
    throw new BadRequestException();
  }


  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Get('')
  @ApiQuery({ name: 'chart_name', type: 'enum', enum: ChartName, example: ChartName.Views, required: true })
  @ApiQuery({ name: 'time_frame', type: 'enum', enum: TimeFrame, example: TimeFrame.OneDay, required: true })
  @ApiQuery({ name: 'from', type: 'date', example: '2022-06-30', required: false })
  @ApiQuery({ name: 'to', type: 'date', example: '2022-07-31', required: false })
  @HttpCode(HttpStatus.OK)
  async chartViews(
    @CurrentUser() user: User,
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('chart_name') chartName: ChartName,
    @Query('time_frame') timeFrame: TimeFrame,
  ) {

    if (user.roles.includes(Role.Admin)) {
      const chartResponse = await this.chartService.chartForAdmin(from, to, timeFrame, chartName);
      return chartResponse;
    }
    if (user.roles.includes(Role.Writer)) {
      const chartResponse = await this.chartService.chartForWriter(user.id, from, to, timeFrame, chartName);
      return chartResponse;
    }
    throw new BadRequestException();
  }
}
