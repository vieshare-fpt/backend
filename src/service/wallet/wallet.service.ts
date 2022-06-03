
import { TransactionEnum } from '@constant/type-transaction.enum';
import { WalletEntity } from '@data/entity/wallet.entity';
import { UserNotExistedException } from '@exception/user/user-not-existed.exception';
import { BalanceNotEnoughException } from '@exception/wallet/balance-not-enough.exception';
import { WalletAlreadyExistedException } from '@exception/wallet/wallet-already-existed.exception';
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
    userId: string,
  ): Promise<WalletEntity> {
    const userExisted = await this.userRepository.findOne(userId);
    if (!userExisted) {
      throw new UserNotExistedException();
    }

    const walletExisted = await this.walletRepository.findOne({ userId: userExisted.id });
    if (walletExisted) {
      throw new WalletAlreadyExistedException();
    }
    const walletEntity: WalletEntity = new WalletEntity();
    walletEntity.userId = userId;
    walletEntity.balance = 0;

<<<<<<< HEAD
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
=======
    return await this.walletRepository.save(walletEntity);
  }

  //To do fix
  async updateWallet(
    userId: string,
    amount: number,
    typeTransaction: TransactionEnum,
  ): Promise<boolean> {
    const userExisted = await this.userRepository.findOne(userId);
    if (!userExisted) {
      throw new UserNotExistedException();
    }
    const isCheck = await this.walletRepository.isCheck(userId, amount, typeTransaction);
    if (!isCheck) {
      throw new BalanceNotEnoughException();
>>>>>>> ace27344ce38f549019086d21bc36d70f9e8896b
    }
    return (await this.walletRepository.
      update({ id: userId }, { balance: amount })).affected ? true : false;
  }


  async getWalletByUserId(
    userId: string
  ): Promise<WalletEntity> {
    const existedUser = await this.userRepository.findOne(userId);
    if (!existedUser) {
      throw new UserNotExistedException();
    }

    return await this.walletRepository.findOne({ userId: userId });
  }


}
