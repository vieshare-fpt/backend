/*
https://docs.nestjs.com/providers#services
*/

import { TransactionEnum } from '@constant/type-transaction.enum';
import { TransactionEntity } from '@data/entity/transaction.entity';
import { TransactionRequest } from '@data/request/new-transaction.request';
import { Injectable } from '@nestjs/common';
import { TransactionRepository } from '@repository/transaction.repository';
import { WalletRepository } from '@repository/wallet.repository';

@Injectable()
export class TransactionService {
    constructor(
        private transactionRepository: TransactionRepository,
    ) { }


    async createTransaction(
        userId: string,
        isSuccess: boolean,
        transactionRequest: TransactionRequest,
    ): Promise<TransactionEntity> {
        const transaction: TransactionEntity = new TransactionEntity();

        transaction.date = new Date();
        transaction.amount = transactionRequest.amount;
        transaction.bankId = transactionRequest.bankId;
        transaction.walletId = transactionRequest.walletId;
        transaction.type = transactionRequest.typeTransaction;
<<<<<<< HEAD
        transaction.isSuccess =  status;
=======
        transaction.isSuccess =  isSuccess;
>>>>>>> ace27344ce38f549019086d21bc36d70f9e8896b

        return await this.transactionRepository.create();
    }

    async getAllTransactions(): Promise<TransactionEntity[]> {
        return this.transactionRepository.find();
    }
}
