import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { TransactionEntity } from "./transaction.entity";
import { UserEntity } from "./user.entity";

@Entity('wallet')
export class WalletEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(
        () => UserEntity,
        (user) => user.wallet
    )
    @JoinColumn({ name: 'userID'})
    user: Promise<UserEntity>;
    @Column({ name: 'userID'})
    user_id: string;

    @Column({ name: 'balance', type: 'float', default: 0 })
    balance: number;

    @OneToMany(
        () => TransactionEntity,
        (transactions) => transactions.wallet_id
    )
    transactions: Promise<TransactionEntity[]>;

}