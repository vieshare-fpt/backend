
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionRepository } from '@repository/transaction.repository';
import { UserRepository } from '@repository/user.repository';
import { WalletRepository } from '@repository/wallet.repository';
import { CommonService } from '@service/common/common.service';
import { TransactionService } from './transaction.service';




@Module({
  imports: [TypeOrmModule.forFeature([TransactionRepository, UserRepository, WalletRepository])],
  providers: [TransactionService, CommonService],
  exports: [TransactionService],
})
export class TransactionsModule { }
