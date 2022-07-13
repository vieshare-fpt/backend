import { HttpResponse } from "@common/http.response";
import { User } from "@common/user";
import { Role } from "@constant/role.enum";
import { CurrentUser } from "@decorator/current-user.decorator";
import { Public } from "@decorator/public.decorator";
import { Roles } from "@decorator/role.decorator";
import { Controller, Get, HttpCode, HttpStatus, Query } from "@nestjs/common";
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
  }

  @Public()
  @Get('views')
  @ApiQuery({ name: 'from', type: 'date', example: '2022-06-31', required: false })
  @ApiQuery({ name: 'to', type: 'date', example: '2022-06-01', required: false })

  @HttpCode(HttpStatus.OK)
  async chartViews(
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    const chartViewsResponse = await this.chartService.chartViews(from,to);
    return HttpResponse.success(chartViewsResponse);
    
  }
}
