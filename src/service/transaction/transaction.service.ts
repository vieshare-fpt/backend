/*
https://docs.nestjs.com/providers#services
*/

import { HttpPagingResponse } from '@common/http-paging.response';
import { HttpResponse } from '@common/http.response';
import { Sort } from '@constant/sort.enum';
import { TransactionEnum } from '@constant/type-transaction.enum';
import { PackageEntity } from '@data/entity/package.entity';
import { TransactionEntity } from '@data/entity/transaction.entity';
import { PagingRequest } from '@data/request/paging.request';
import { PagingRepsone } from '@data/response/paging.response';
import { UserNotExistedException } from '@exception/user/user-not-existed.exception';
import { Injectable } from '@nestjs/common';
import { TransactionRepository } from '@repository/transaction.repository';
import { UserRepository } from '@repository/user.repository';
import { WalletRepository } from '@repository/wallet.repository';
import { CommonService } from '@service/common/common.service';

@Injectable()
export class TransactionService {
    constructor(
        private transactionRepository: TransactionRepository,
        private userRepository: UserRepository,
        private walletRepository: WalletRepository,
        private commonService: CommonService<TransactionEntity | any>
    ) { }



    async getTransactions(
        userId: string,
        bankId: string,
        type: TransactionEnum,
        isSuccess: boolean,
        sort?: Sort,
        paging?: PagingRequest
    ): Promise<HttpResponse<TransactionEntity[]> | HttpPagingResponse<TransactionEntity[]>> {

        const user = await this.userRepository.findOne({ id: userId });
        if (!user) {
            throw new UserNotExistedException();
        }
        const wallet = await this.walletRepository.findOne({ userId: user.id });
        let page = paging.page | 1;
        let perPage = paging.per_page;
        let total = 0;
        let totalPages = 0;
        sort = sort && Sort[sort.toLocaleUpperCase()] ? Sort[sort] : Sort.ASC;
        const where = await this.commonService.removeUndefined({
            bankId,
            type,
            isSuccess
        });
        const transactions = await this.transactionRepository.getTransactionsOrderBy(wallet.id, where, sort, perPage * (page - 1), perPage);
        total = await this.transactionRepository.countTransactionByWalletId(wallet.id);
        totalPages = Math.ceil(total / perPage);
        const metaData = new PagingRepsone(page, perPage, total, totalPages);

        if (!perPage) {
            return HttpPagingResponse.success(transactions);
        }
        return HttpPagingResponse.success(transactions, metaData);

    }
}
