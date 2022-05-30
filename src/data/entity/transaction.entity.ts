import { TransactionEnum } from "@constant/type-transaction.enum";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { BankEntity } from "./bank.entity";
import { UserEntity } from "./user.entity";
import { WalletEntity } from "./wallet.entity";


@Entity('transactions')
export class TransactionEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(
        () => WalletEntity,
        (wallet) => wallet.transactions

    )
    @JoinColumn({name: 'walletID'})
    wallet: Promise<WalletEntity>;
    @Column({name: 'walletID'})
    wallet_id: string;


    @PrimaryColumn({ name: 'date' })
    date: Date;

    @Column({ name: 'amount', type: 'float' })
    amount: number;

    
    @ManyToOne(
        () => BankEntity,
        (bank) => bank.transaction
    )
    @JoinColumn({name: 'bankID'})
    bank: Promise<BankEntity>;
    @Column({name: 'bankID'})
    bank_id: string;

    @Column({ name: 'typeTrans', type: 'enum', enum :TransactionEnum, nullable: false})
    type: TransactionEnum;

    @Column({ name: 'status'})
    isStatus: boolean;

}