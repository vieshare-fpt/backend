/*
https://docs.nestjs.com/providers#services
*/

import { TransactionEntity } from '@data/entity/transaction.entity';
import { Injectable } from '@nestjs/common';
import { TransactionRepository } from '@repository/transaction.repository';

@Injectable()
export class TransactionService {
    constructor(
        private transactionRepository: TransactionRepository,
    ) {}



    async getAllTransactions(): Promise<TransactionEntity[]> {
        return this.transactionRepository.find();
    }
}
