import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('follows')
export class FollowEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;


  @ManyToOne(
    () => UserEntity,
    (userEntity) => userEntity.user)
  @JoinColumn({ name: 'userId' })
  user: Promise<UserEntity>;
  @Column({ name: 'userId', type: 'uuid', nullable: false })
  userId: string;


  @ManyToOne(
    () => UserEntity,
    (userEntity) => userEntity.follow)
  @JoinColumn({ name: 'followId' })
  follow: Promise<FollowEntity>
  @Column({ name: 'followId', type: 'uuid', nullable: false })
  followerId: string;

  @CreateDateColumn({ name: 'dateFollowed', nullable: false })
  followAt: Date;

}
