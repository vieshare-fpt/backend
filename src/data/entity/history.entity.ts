import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PostEntity } from "./post.entity";
import { UserEntity } from "./user.entity";



@Entity('history')
export class HistoryEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'totalTime', type: 'bigint' })
    totalTime: number;

    @CreateDateColumn({ name: 'lastDateRead' })
    lastDateRead: Date;

    @ManyToOne(
        () => UserEntity,
        (userEntity) => userEntity.history
    )
    @JoinColumn({ name: 'userId' })
    user: string;

    @ManyToOne(
        () => PostEntity,
        (postEntity) => postEntity.history
    )
    @JoinColumn({ name: 'postId' })
    post: string;
}