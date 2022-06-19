
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionRepository } from '@repository/transaction.repository';
import { UserRepository } from '@repository/user.repository';
import { WalletRepository } from '@repository/wallet.repository';
import { WalletService } from './wallet.service';

@Module({
  imports: [TypeOrmModule.forFeature([WalletRepository, UserRepository, TransactionRepository])],
  providers: [WalletService],
  exports: [WalletService]
})
export class WalletModule { }
