import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('follows')
export class FollowEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;


  @ManyToOne(
    () => UserEntity,
    (userEntity) => userEntity.user)
  @JoinColumn({ name: 'userID' })
  user: Promise<UserEntity>;
  @Column({ name: 'userID', type: 'uuid', nullable: false })
  user_id: string;


  @ManyToOne(
    () => UserEntity,
    (userEntity) => userEntity.follow)
  @JoinColumn({ name: 'followID' })
  follow: Promise<FollowEntity>
  @Column({ name: 'followID', type: 'uuid', nullable: false })
  follower_id: string;

  @CreateDateColumn({ name: 'dateFollowed', nullable: false})
  follow_at: Date;

}
