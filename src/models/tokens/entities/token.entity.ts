import { User } from "src/models/users/entities/user.entity";
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, OneToOne } from "typeorm";

@Entity('token')
export class Token {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId: number;

    @Column({ nullable: true })
    agent: string;

    @Column({ type: 'date' })
    validUntil: Date;

    @OneToOne(() => User, (user) => user.token)
    @JoinColumn({ name: 'userId' })
    user: Promise<User>;
}

