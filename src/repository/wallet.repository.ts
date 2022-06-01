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

  async isCheck(
    userId: string,
    amount: number,
    typeTrans: string,
  ): Promise<boolean> {
    return TransactionEnum.Withdraw == typeTrans && amount <= await this.getBalanceByUserId(userId);
  }
}
