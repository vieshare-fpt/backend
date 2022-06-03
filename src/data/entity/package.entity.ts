import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { SubscriptionEntity } from "./subscription.entity";

@Entity('packages')
export class PackageEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'expiresAfterNumberOfDays'})
  expiresAfterNumberOfDays: number;

  @Column({ name: 'price', type: 'float' })
  price: number;

  @CreateDateColumn({ name: 'createDate'})
  createDate: Date;

  @Column({ name: 'isActive', type: 'boolean' })
  isActive: Boolean;

  @OneToMany(
    () => SubscriptionEntity,
    (subscriptionEntity) => subscriptionEntity.package
  )
  packages: Promise<PackageEntity[]>
}
