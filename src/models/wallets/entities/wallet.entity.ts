import { UserEntity } from "src/models/users/entities/user.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'wallet' })
export class WalletEntity {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column({ name: 'userId' })
    userId: number

    @Column({ name: 'balance', type: 'float', default: 0 })
    balance: number

    @OneToOne(() => UserEntity, (userEntity) => userEntity.wallet)
    @JoinColumn({ name: 'userId' })
    user: Promise<UserEntity>
}
