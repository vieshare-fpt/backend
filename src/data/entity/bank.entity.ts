import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TransactionEntity } from "./transaction.entity";


@Entity('bank')
export class BankEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({name: 'name', nullable: false})
    bank_name: string;

    @OneToMany(
        () => TransactionEntity,
        (transaction) => transaction.bank,
    )
    transaction: Promise<TransactionEntity[]>;
}