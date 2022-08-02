
import { TransactionEnum } from '@constant/type-transaction.enum';
import { WalletEntity } from '@data/entity/wallet.entity';
import { UpdateWalletRequest } from '@data/request/update-wallet.request';
import { UserNotExistedException } from '@exception/user/user-not-existed.exception';
import { BalanceNotEnoughException } from '@exception/wallet/balance-not-enough.exception';
import { InvalidAmountException } from '@exception/wallet/invalid-amount.exception';
import { WalletAlreadyExistedException } from '@exception/wallet/wallet-already-existed.exception';
import { Injectable } from '@nestjs/common';
import { TransactionRepository } from '@repository/transaction.repository';
import { UserRepository } from '@repository/user.repository';
import { WalletRepository } from '@repository/wallet.repository';

@Injectable()
export class WalletService {
  constructor(
    private walletRepository: WalletRepository,
    private userRepository: UserRepository,
    private transactionRepository: TransactionRepository,
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

    return await this.walletRepository.save(walletEntity);
  }


  async updateWallet(
    userId: string,
    updateWalletRequest: UpdateWalletRequest,
  ): Promise<boolean> {
    const userExisted = await this.userRepository.findOne(userId);
    if (!userExisted) {
      throw new UserNotExistedException();
    }


    let walletId = await this.walletRepository.getWalletId(userId);
    if (!walletId) {
      const newWallet = await this.createWallet(userId);
      walletId = newWallet.id;
    }
    
    if(updateWalletRequest.amount < 10000) {
      throw new InvalidAmountException();
    }


    const isCheck = await this.walletRepository.isCheckBalance(userId, updateWalletRequest.amount, updateWalletRequest.type);
    if (!isCheck) {
      throw new BalanceNotEnoughException();
    }

    const newBalance = await this.walletRepository.getNewBalance(userId, updateWalletRequest.amount, updateWalletRequest.type);
    const updateResult = (await this.walletRepository.
      update({ id: walletId }, { balance: newBalance })).affected ? true : false;



    await this.transactionRepository.createTransaction(walletId, updateResult, updateWalletRequest);


    return updateResult;
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
