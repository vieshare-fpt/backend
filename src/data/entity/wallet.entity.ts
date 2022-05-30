import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('wallet')
export class WalletEntity {
    @PrimaryGeneratedColumn('uuid')
    id : string;

    @Column({name: 'balance', type: 'float', default: 0})
    balance : number;

    //TODO
}