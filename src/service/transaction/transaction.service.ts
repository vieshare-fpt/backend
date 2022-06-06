/*
https://docs.nestjs.com/providers#services
*/

import { TransactionEntity } from '@data/entity/transaction.entity';
import { TransactionRequest } from '@data/request/new-transaction.request';
import { Injectable } from '@nestjs/common';
import { TransactionRepository } from '@repository/transaction.repository';

@Injectable()
export class TransactionService {
    constructor(
        private transactionRepository: TransactionRepository,
    ) { }


    async createTransaction(
        isSuccess: boolean,
        transactionRequest: TransactionRequest,
    ): Promise<TransactionEntity> {
        const transaction: TransactionEntity = new TransactionEntity();

        transaction.date = new Date();
        transaction.amount = transactionRequest.amount;
        transaction.bankId = transactionRequest.bankId;
        transaction.walletId = transactionRequest.walletId;
        transaction.type = transactionRequest.typeTransaction;
        transaction.isSuccess =  isSuccess;

        return await this.transactionRepository.create();
    }

    async getAllTransactions(): Promise<TransactionEntity[]> {
        return this.transactionRepository.find();
    }
}
