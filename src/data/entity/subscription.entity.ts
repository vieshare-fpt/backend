import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('subscriptions')
export class SubscriptionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'userId' })
  userId: string;

  @Column({ name: 'packageId' })
  packageId: string;

  @Column({ name: 'date', type: 'bigint' })
  date: number

}
