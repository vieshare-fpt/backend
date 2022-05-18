import { UserEntity } from "src/models/users/entities/user.entity";
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from "typeorm";

@Entity('token')
export class TokenEntity  {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: string

    @Column({ name: 'refreshToken', type: 'uuid' })
    refreshToken: string;

    @Column({name:'userId'})
    userId: number;

    @Column({ name: 'agent', nullable: true })
    agent: string;

    @Column({ name: 'dateExpire'})
    dateExpire: Date;

    @ManyToOne(() => UserEntity, (userEntity) => userEntity.tokens)
    @JoinColumn({ name: 'userId' })
    user: Promise<UserEntity>;
}

