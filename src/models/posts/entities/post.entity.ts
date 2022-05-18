import { CategoryEntity } from "src/models/categories/entities/category.entity";
import { CommentEntity } from "src/models/comments/entities/comment.entity";
import { ReactionEntity } from "src/models/reactions/entities/reaction.entity";
import { UserEntity } from "src/models/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

export enum Status {
    PUBLISH = 'PUBLISH',
    PENDING = 'PENDING',
    HIDDEN = 'HIDDEN',
    REMOVED = 'REMOVED'
}

@Entity({ name: 'post' })
export class PostEntity {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number

    @Column({ name: 'title', type: 'nvarchar', length: 255 })
    title: string

    @Column({ name: 'categoryId' })
    categoryId: number

    @Column({ name: 'content', type: 'text' })
    content: string

    @Column({ name: 'ownerId' })
    ownerId: number

    @Column({ name: 'publishDate', type: 'datetime' })
    publishDate: Date

    @Column({ name: 'lastUpdated', type: 'datetime' })
    lastUpdated: Date

    @Column({ name: 'views' })
    views: number

    @Column({ name: 'status', type: 'enum', enum: Status, default: Status.PUBLISH, nullable: false })
    status: Status;

    @ManyToOne(() => UserEntity, (userEntity) => userEntity.posts)
    @JoinColumn({ name: 'ownerId' })
    owner: Promise<UserEntity>;

    @ManyToOne(() => CategoryEntity, (categoryEntity) => categoryEntity.posts)
    @JoinColumn({ name: 'categoryId' })
    category: Promise<CategoryEntity>;

    @OneToMany(() => CommentEntity, (commentEntity) => commentEntity.post)
    comments?: Promise<CommentEntity[]>

    @OneToMany(() => ReactionEntity, (reactionEntity) => reactionEntity.post)
    reactions?: Promise<ReactionEntity[]>
}
