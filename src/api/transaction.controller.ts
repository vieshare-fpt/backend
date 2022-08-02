import { HttpPagingResponse } from "@common/http-paging.response";
import { HttpResponse } from "@common/http.response";
import { User } from "@common/user";
import { Sort } from "@constant/sort.enum";
import { TransactionEnum } from "@constant/type-transaction.enum";

import { TransactionEntity } from "@data/entity/transaction.entity";
import { PagingRequest } from "@data/request/paging.request";
import { CurrentUser } from "@decorator/current-user.decorator";
import { Controller, Get, HttpCode, HttpStatus, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { TransactionService } from "@service/transaction/transaction.service";


@ApiTags('Transaction')
@Controller('api/transaction')
export class TransactionController {
    constructor(
        private transactionService: TransactionService) { }



    @Get('')
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiQuery({ name: 'sort', type: 'enum', enum: Sort, example: Sort.DESC, required: false })
    @ApiQuery({ name: 'bank_id', type: 'string', example: '0258541a-ff5b-11ec-9f25-0242ac130002', required: false })
    @ApiQuery({ name: 'type', type: 'enum', enum: TransactionEnum, example: TransactionEnum.DEPOSIT, required: false })
    @ApiQuery({ name: 'per_page', type: 'number', example: 10, required: false })
    @ApiQuery({ name: 'page', type: 'number', example: 1, required: false })
    async getTransactions(
        @CurrentUser() user: User,
        @Query('sort') sort: Sort,
        @Query("bank_id") bank_id: string,
        @Query("type") type: TransactionEnum,
        @Query() paging: PagingRequest,
    ): Promise<HttpResponse<TransactionEntity[]> | HttpPagingResponse<TransactionEntity[]> | any> {
        const transactions = await
            this.transactionService.getTransactions(user.id, bank_id, type, sort, paging);
        return transactions;
    }
}