
import { PostEntity } from "src/models/posts/entities/post.entity";
import { UserEntity } from "src/models/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'comment' })
export class CommentEntity {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number

    @Column({ name: 'postId' })
    postId: number

    @Column({ name: 'userId' })
    userId: number

    @Column({ name: 'content', type: 'text' })
    content: string

    @Column({ name: 'dateCommented', type: 'datetime' })
    dateCommented: Date

    @ManyToOne(() => UserEntity, (userEntity) => userEntity.comments)
    @JoinColumn({ name: 'userId' })
    user: UserEntity;

    @ManyToOne(() => PostEntity, (postEntity) => postEntity.comments)
    @JoinColumn({ name: 'postId' })
    post?: UserEntity;

}
