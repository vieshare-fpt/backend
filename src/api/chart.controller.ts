import { HttpResponse } from "@common/http.response";
import { User } from "@common/user";
import { Role } from "@constant/role.enum";
import { CurrentUser } from "@decorator/current-user.decorator";
import { Public } from "@decorator/public.decorator";
import { Roles } from "@decorator/role.decorator";
import { Controller, Get, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ChartService } from "@service/chart/chart.service";


@ApiTags('Chart')
@Controller('/api/charts')
export class ChartController {
  constructor(
    private chartService: ChartService
  ) { }

  @Public()
  @ApiBearerAuth()
  @Roles(Role.Admin, Role.Writer)
  @Get('total')
  @HttpCode(HttpStatus.OK)
  async activationTheFormula(
    @CurrentUser() user: User,
  ): Promise<HttpResponse<any>> {
    if (user.roles.includes(Role.Admin)) {
      const totalResponse = await this.chartService.getAdminTotal();
      return HttpResponse.success(totalResponse);
    }
  }
}
