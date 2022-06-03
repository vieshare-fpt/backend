
import { TransactionEnum } from '@constant/type-transaction.enum';
import { WalletEntity } from '@data/entity/wallet.entity';
import { UserNotExistedException } from '@exception/user/user-not-existed.exception';
import { BalanceNotEnough } from '@exception/wallet/balance-not-enough.exception';
import { Injectable } from '@nestjs/common';
import { UserRepository } from '@repository/user.repository';
import { WalletRepository } from '@repository/wallet.repository';

@Injectable()
export class WalletService {
    constructor(
        private walletRepository: WalletRepository,
        private userRepository: UserRepository,
    ) { }

    async createWallet(
        user_id: string,
    ): Promise<WalletEntity> {
        const existedUser = await this.userRepository.findOne(user_id);
        if (!existedUser) {
            throw new UserNotExistedException();
        }

        const walletEntity: WalletEntity = new WalletEntity();
        walletEntity.user_id = user_id;
        walletEntity.balance = 0;

        return await this.walletRepository.save(walletEntity);
    }

    async updateWallet(
        user_id: string,
        amount: number,
        typeTransaction: TransactionEnum,
    ): Promise<boolean> {
        const existedUser = await this.userRepository.findOne(user_id);
        if (!existedUser) {
            throw new UserNotExistedException();
        }
        const isCheck = await this.walletRepository.isCheck(user_id, amount, typeTransaction);
        if (!isCheck) {
            throw new BalanceNotEnough();
             
        }
        return (await this.walletRepository.
            update({ id: user_id }, { balance: amount })).affected ? true : false;
    }

    async getWalletByID(
        user_id: string
    ): Promise<WalletEntity> {
        const existedUser = await this.userRepository.findOne(user_id);
        if (!existedUser) {
            throw new UserNotExistedException();
        }

        return await this.walletRepository.findOne(user_id);
    }

    //TODO: deleteWallet

}
