import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { SubscriptionEntity } from "./subscription.entity";

@Entity('packages')
export class PackageEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'expirationTime', type: 'bigint' })
  expirationTime: number;

  @Column({ name: 'price', type: 'float' })
  price: number;

  @Column({ name: 'createDate', type: 'bigint' })
  createDate: number;

  @Column({ name: 'isActive', type: 'boolean' })
  isActive: Boolean;

  @OneToMany(
    () => SubscriptionEntity,
    (subscriptionEntity) => subscriptionEntity.package
  )
  packages: Promise<PackageEntity[]>
}
