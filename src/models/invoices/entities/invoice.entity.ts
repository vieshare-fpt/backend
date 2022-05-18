import { User } from "src/models/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export enum Status {
    ACTIVE = 'ACTIVE',
    EXPIRE = 'EXPIRE',
    PENDING = 'PENDING'
}

@Entity({ name: 'invoice' })
export class Invoice {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number

    @Column({ name: 'userId' })
    userId: number

    @Column({ name: 'fromDate', type: 'datetime' })
    fromDate: Date

    @Column({ name: 'toDate', type: 'datetime' })
    toDate: Date

    @Column({ name: 'status', type: 'enum', enum: Status, default: Status.ACTIVE, nullable: false })
    status: Status;

    @ManyToOne(() => User, (user) => user.invoices)
    @JoinColumn({ name: 'userId' })
    user: Promise<User>


}
