
import { PostEntity } from "src/models/posts/entities/post.entity";
import { UserEntity } from "src/models/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export enum Reacts {
    LIKE = 'LIKE',
    DISLIKE = 'DISLIKE',
    NONE = 'NONE'
}

@Entity({ name: 'reaction' })
export class ReactionEntity {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number

    @Column({ name: 'postId' })
    postId: number

    @Column({ name: 'userId' })
    userId: number


    @Column({ name: 'comment', type: 'enum', enum: Reacts, default: Reacts.NONE })
    reactType: Reacts

    @Column({ name: 'dateReacted', type: 'datetime' })
    dateReacted: Date


    @ManyToOne(() => UserEntity, (userEntity) => userEntity.reactions)
    @JoinColumn({ name: 'userId' })
    user: UserEntity;

    @ManyToOne(() => PostEntity, (postEntity) => postEntity.reactions)
    @JoinColumn({ name: 'postId' })
    post?: UserEntity;

}
