/*
https://docs.nestjs.com/providers#services
*/

import { TransactionEnum } from '@constant/type-transaction.enum';
import { TransactionEntity } from '@data/entity/transaction.entity';
import { TransactionRequest } from '@data/request/new-transaction.request';
import { BalanceNotEnough } from '@exception/wallet/balance-not-enough.exception';
import { Injectable } from '@nestjs/common';
import { TransactionRepository } from '@repository/transaction.repository';
import { WalletRepository } from '@repository/wallet.repository';

@Injectable()
export class TransactionService {
    constructor(
        private transactionRepository: TransactionRepository,
    ) { }


    async createTransaction(
        user_id: string,
        status: boolean,
        transactionRequest: TransactionRequest,
    ): Promise<TransactionEntity> {
        const transaction: TransactionEntity = new TransactionEntity();

        transaction.date = new Date();
        transaction.amount = transactionRequest.amount;
        transaction.bank_id = transactionRequest.bankID;
        transaction.wallet_id = transactionRequest.walletID;
        transaction.type = transactionRequest.typeTransaction;
        transaction.isSuccess =  status;

        return await this.transactionRepository.create();
    }

    async getAllTransactions(): Promise<TransactionEntity[]> {
        return this.transactionRepository.find();
    }
}
