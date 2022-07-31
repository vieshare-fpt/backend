import { Sort } from "@constant/sort.enum";
import { BankEntity } from "@data/entity/bank.entity";
import { TransactionEntity } from "@data/entity/transaction.entity";
import { UpdateWalletRequest } from "@data/request/update-wallet.request";
import { EntityRepository, FindConditions, Repository } from "typeorm";

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

        return await this.save(transaction);
    }



    async getTransactionsOrderBy(walletId: string,where: FindConditions<TransactionEntity> , sort?: Sort, skip?: number, take?: number):
        Promise<TransactionEntity[] | any> {
        let transactionsWhereAndJoin = this.createQueryBuilder('transactions')
            .innerJoinAndSelect('transactions.bank', 'bank');

       
        const transaction = await transactionsWhereAndJoin
            .andWhere(where)
            .skip(skip || 0)
            .take(take || 0)
            .getMany();
        return transaction;
    }
    async countTransactionByWalletId(walletId: string): Promise<number> {
        const count = await this.count(
            {
                where: {
                    walletId: walletId
                }
            });
        return count;
    }

}