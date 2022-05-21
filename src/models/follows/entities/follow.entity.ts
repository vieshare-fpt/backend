import { UserEntity } from "src/models/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('follow')
export class FollowEntity {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number

    @Column({ name: 'userId' })
    userId: number

    @Column({ name: 'followingId' })
    followingId: number

    @Column({ name: 'dateFollowed', type: 'datetime' })
    dateFollowed: Date

    @ManyToOne(() => UserEntity, (userEntity) => userEntity.followers)
    @JoinColumn({ name: 'userId' })
    users: Promise<UserEntity[]>

    @ManyToOne(() => UserEntity, (userEntity) => userEntity.userFollows)
    @JoinColumn({ name: 'followingId', referencedColumnName: 'id' })
    userFollowed?: Promise<UserEntity>

}
