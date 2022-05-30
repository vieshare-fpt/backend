import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('subscriptions')
export class SubscriptionEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(
        () => UserEntity,
        (userEntity) => userEntity.subscription,
    )
    @JoinColumn({name:'userID'})
    userID : string;

    @CreateDateColumn({ name: 'fromDate' })
    start_at: Date;

    @CreateDateColumn({ name: 'toDate' })
    end_at: Date;

    @Column({name: 'status', type: 'enum', nullable: false})
    status: any;
    subscriptionEntity: Promise<Date>; 

}
