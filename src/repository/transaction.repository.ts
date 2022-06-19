import { TransactionEntity } from "@data/entity/transaction.entity";
import { UpdateWalletRequest } from "@data/request/update-wallet.request";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(TransactionEntity)
export class TransactionRepository extends Repository<TransactionEntity> {
    async createTransaction(
        walletId: string,
        isSuccess: boolean, 
        updateWallet: UpdateWalletRequest,
    ): Promise<any> {

        
        const transaction = new TransactionEntity();

        transaction.date = new Date();
        transaction.amount = updateWallet.amount;
        transaction.bankId = updateWallet.bankId;
        transaction.type = updateWallet.type;
        transaction.isSuccess = isSuccess;
        transaction.walletId = walletId;
        
        return await this.create(transaction);


    }
}