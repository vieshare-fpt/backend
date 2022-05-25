import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PostEntity } from "./post.entity";
import { UserEntity } from "./user.entity";

@Entity('comments')
export class CommentEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => PostEntity, (postEntity) => postEntity.comments)
    @JoinColumn({ name: 'postId' })
    post: Promise<PostEntity>

    @Column({ name: 'postId', type: 'uuid' })
    postId: string;

    @ManyToOne(() => UserEntity, (userEntity) => userEntity.comments)
    @JoinColumn({ name: 'userId' })
    user: Promise<UserEntity>

    @Column({ name: 'userId', type: 'uuid' })
    userId: string;

    @Column({ name: 'connent', type: 'text' })
    content: string;

    @Column({ name: 'publishDate', type: 'bigint' })
    publishDate: number;

    @Column({ default: false })
    isDelete: boolean;

}