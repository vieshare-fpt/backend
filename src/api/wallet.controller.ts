
import { User } from "@common/user";
import { CurrentUser } from "@decorator/current-user.decorator";
import { Controller, Get } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { TransactionService } from "@service/transaction/transaction.service";
import { WalletService } from "@service/wallet/wallet.service";


@ApiTags('Wallet')
@Controller('api/wallets')
export class WalletController {
  constructor(
    private walletService: WalletService,
  ) { }

  @ApiBearerAuth()
  @Get('')
  async createWallet(
    @CurrentUser() currentUser: User,
  ): Promise<any> {
    const walletReponse = await this.walletService.getWalletByUserId(currentUser.id);
    return walletReponse;
  }




}
