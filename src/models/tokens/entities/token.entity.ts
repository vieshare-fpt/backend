import { User } from "src/models/users/entities/user.entity";
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, OneToOne, PrimaryColumn } from "typeorm";

@Entity('token')
export class Token {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: string

    @Column({ name: 'refreshToken', type: 'uuid' })
    refreshToken: string;

    @Column({name:'userId',type:'number'})
    userId: number;

    @Column({ name: 'agent', nullable: true })
    agent: string;

    @Column({ name: 'dateExpire'})
    dateExpire: Date;

    @ManyToOne(() => User, (user) => user.tokens)
    @JoinColumn({ name: 'userId' })
    user: Promise<User>;
}

