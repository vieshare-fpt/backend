import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { TransactionEntity } from "./transaction.entity";
import { UserEntity } from "./user.entity";

@Entity('wallets')
export class WalletEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(
        () => UserEntity,
        (user) => user.wallet
    )
    @JoinColumn({ name: 'userId'})
    user: Promise<UserEntity>;
    
    @Column({ name: 'userId'})
    userId: string;

    @Column({ name: 'balance', type: 'float', default: 0 })
    balance: number;

    @OneToMany(
        () => TransactionEntity,
        (transactions) => transactions.wallet
    )
    transactions: Promise<TransactionEntity[]>;

}
