import { HttpResponse } from "@common/http.response";
import { Role } from "@constant/role.enum";
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
  // @ApiBearerAuth()
  // @Roles(Role.Admin)
  @Get('admin/total')
  @HttpCode(HttpStatus.OK)
  async activationTheFormula(
  ): Promise<HttpResponse<any>> {
    const totalResponse = await this.chartService.getAdminTotal();
    return HttpResponse.success(totalResponse);
  }
}
