import { WalletEntity } from "@data/entity/wallet.entity";
import { EntityRepository, Repository } from "typeorm";
import { TransactionEnum } from '@constant/type-transaction.enum';

@EntityRepository(WalletEntity)
export class WalletRepository extends Repository<WalletEntity> {
    async getBalance(
        id: string,
    ): Promise<number> {
        const balance = (await this.findOne(id)).balance;
        return balance;
    }

    async isCheck(
        user_id: string,
        amount: number,
        typeTrans: string,
    ) : Promise<boolean> {
        return TransactionEnum.Withdraw == typeTrans && amount <= await this.getBalance(user_id);    
    }
}