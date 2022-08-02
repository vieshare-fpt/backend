import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PackageEntity } from "./package.entity";
import { UserEntity } from "./user.entity";

@Entity('subscriptions')
export class SubscriptionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    () => UserEntity,
    (userEntity) => userEntity.user
  )
  @JoinColumn({ name: 'userId' })
  user: Promise<UserEntity>

  @Column({ name: 'userId' })
  userId: string;

  @ManyToOne(
    () => PackageEntity,
    (packageEntity) => packageEntity.packages
  )
  
  @JoinColumn({ name: 'packageId' })
  package: Promise<PackageEntity>
  @Column({ name: 'packageId' })
  packageId: string;

  @Column({ name: 'date', type: 'date' })
  date: Date


}
