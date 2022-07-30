import { WalletEntity } from "@data/entity/wallet.entity";
import { EntityRepository, Repository } from "typeorm";
import { TransactionEnum } from '@constant/type-transaction.enum';

@EntityRepository(WalletEntity)
export class WalletRepository extends Repository<WalletEntity> {
  async getBalanceById(
    id: string,
  ): Promise<number> {
    const balance = (await this.findOne(id)).balance;
    return balance;
  }

  async getBalanceByUserId(
    userId: string,
  ): Promise<number> {
    const balance = (await this.findOne({ userId: userId })).balance;
    return balance;
  }

  //check balance with type of transaction
  async isCheckBalance(
    userId: string,
    amount: number,
    typeTrans: string,
  ): Promise<boolean> {
    if (TransactionEnum.WITHDRAW == typeTrans && amount <= await this.getBalanceByUserId(userId)) {
      return false
    }
    return true;

  }

  async getNewBalance(
    userId: string,
    amount: number,
    typeTrans: string,
  ): Promise<number> {
    const balance = await this.getBalanceByUserId(userId);
    if (TransactionEnum.WITHDRAW == typeTrans) {
      return balance - amount;
    }
    return balance + amount;
  }

  async getWalletId(userId: string):
    Promise<string> {
    const walletId = await (await this.findOne({ userId: userId })).id;

    return walletId;
  }

}
