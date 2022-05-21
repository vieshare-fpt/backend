import { PostEntity } from "src/models/posts/entities/post.entity";
import { UserEntity } from "src/models/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

export enum ReadingStatus {
    FINISH = 'FINISH',
    UNFINISH = 'UNFINISH'
}

@Entity({ name: 'history' })
export class HistoryEntity {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column({ name: 'userId' })
    userId: number;

    @Column({ name: 'postId' })
    postId: number;

    @Column({ name: 'totalTime', type: 'float' })
    totalTime: number;

    @Column({ name: 'lastDateRead', type: 'datetime' })
    lastDateRead: Date;

    @Column({ name: 'status', type: 'enum', enum: ReadingStatus })
    status: ReadingStatus;

    @ManyToOne(() => UserEntity, (userEntity) => userEntity.history)
    users: Promise<UserEntity>;

    @ManyToOne(() => PostEntity, (postEntity) => postEntity.history)
    posts: Promise<PostEntity>;

}
