import { HttpResponse } from "@common/http.response";
import { User } from "@common/user";
import { TransactionRequest } from "@data/request/new-transaction.request";
import { CurrentUser } from "@decorator/current-user.decorator";
import { Body, Controller, Patch, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { TransactionService } from "@service/transaction/transaction.service";
import { WalletService } from "@service/wallet/wallet.service";

@ApiBearerAuth()
@ApiTags('Wallet')
@Controller('api/wallets')
export class WalletController {
    constructor(
        private walletService: WalletService,
        private transactionService: TransactionService,
    ) { }

    @ApiBearerAuth()
    @Post('create')
    async createWallet(
        @CurrentUser() currentUser: User,
    ): Promise<any> {
        const walletReponse = await this.walletService.createWallet(currentUser.id);

        return walletReponse;
    }


    @ApiBearerAuth()
    @Patch('update')
    async updateWallet(
        @CurrentUser() currentUser: User,
        @Body() transactionRequest: TransactionRequest,
    ): Promise<any> {
        const isUpdate = await this.walletService
            .updateWallet(currentUser.id, transactionRequest.amount, transactionRequest.typeTransaction);

        const transaction = await this.transactionService
            .createTransaction(currentUser.id, isUpdate, transactionRequest);

        return HttpResponse.success(transaction);
    }




}