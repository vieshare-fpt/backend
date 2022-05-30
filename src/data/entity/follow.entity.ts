import { CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('follows')
export class FollowEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // @Column({type: 'uuid', nullable: false})
    // userId: string;
    @ManyToOne(
        () => UserEntity,
        (userEntity) => userEntity.user)
    @JoinColumn({ name: 'userId' })
    userID: string;

    // @Column({name:'followerID', type: 'uuid', nullable: false})
    // followerId: string;
    @ManyToOne(
        () => UserEntity,
        (userEntity) => userEntity.follower)
    @JoinColumn({ name: 'followerId' })
    followerID: string;

    @CreateDateColumn({ name: 'dateFollowed', nullable: false })
    follow_at: Date;

}
