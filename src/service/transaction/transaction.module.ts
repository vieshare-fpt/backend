
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionRepository } from '@repository/transaction.repository';
import { TransactionService } from './transaction.service';




@Module({
  imports: [TypeOrmModule.forFeature([TransactionRepository])],
  providers: [TransactionService],
  exports: [TransactionService],
})
export class TransactionsModule { }
