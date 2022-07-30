
import { HttpResponse } from "@common/http.response";
import { User } from "@common/user";
import { Role } from "@constant/role.enum";
import { WalletEntity } from "@data/entity/wallet.entity";
import { UpdateWalletRequest } from "@data/request/update-wallet.request";
import { CurrentUser } from "@decorator/current-user.decorator";
import { Roles } from "@decorator/role.decorator";
import { Body, Controller, Get, HttpCode, HttpStatus, Patch } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { WalletService } from "@service/wallet/wallet.service";


@ApiTags('Wallet')
@Controller('api/wallet')
export class WalletController {
  constructor(
    private walletService: WalletService,
  ) { }

  @ApiBearerAuth()
  @Get('info')
  async createWallet(
    @CurrentUser() currentUser: User,
  ): Promise<HttpResponse<WalletEntity>> {
    const walletReponse = await this.walletService.getWalletByUserId(currentUser.id);
    return HttpResponse.success(walletReponse);
  }
  

  @ApiBearerAuth()
  @Patch()
  @Roles(Role.Admin, Role.Writer, Role.User)
  @HttpCode(HttpStatus.OK)
  async updateWallet(
    @CurrentUser() user: User,
    @Body() body : UpdateWalletRequest,
  ): Promise<any> {
     const update = await this.walletService.updateWallet(user.id, body);
     return HttpResponse.success(update);
  }
}
