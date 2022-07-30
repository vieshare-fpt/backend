import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('follows')
export class FollowEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;


  @ManyToOne(
    () => UserEntity,
    (userEntity) => userEntity.followers)
  @JoinColumn({ name: 'userId' })
  user: Promise<UserEntity>; // follower
  @Column({ name: 'userId', type: 'uuid', nullable: false }) 
  userId: string;


  @ManyToOne(
    () => UserEntity,
    (userEntity) => userEntity.follows)
  @JoinColumn({ name: 'followId' })  // follow
  follow: Promise<UserEntity>

  @Column({ name: 'followId', type: 'uuid', nullable: false })
  followId: string;

  @CreateDateColumn({ name: 'dateFollowed', nullable: false })
  followAt: Date;

}
