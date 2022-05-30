
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '@repository/user.repository';
import { WalletRepository } from '@repository/wallet.repository';
import { WalletService } from './wallet.service';

@Module({
  imports: [TypeOrmModule.forFeature([WalletRepository, UserRepository])],
  providers: [WalletService],
  exports: [WalletService]
})
export class WalletModule { }
